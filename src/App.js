import React from 'react';
import './App.css';

import Amplify from 'aws-amplify';
import PropTypes from 'prop-types';
import {
    XYPlot,
    XAxis,
    YAxis,
    LineSeries,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalRectSeries
} from 'react-vis';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    NavLink,
    Link,
    useParams,
    useLocation
} from 'react-router-dom';
import {
    Divider, Form, Icon, Input, Modal, Button, Card, Menu, Dropdown,
    Container, Header, Segment, Placeholder, Grid, Item
} from 'semantic-ui-react';

import API from '@aws-amplify/api';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';

import faker from 'faker';
import Analytics from '@aws-amplify/analytics';

import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const CATEGORIES = ['Outdoors', 'Cities'];
const COLORS = ['orange', 'yellow', 'green', 'blue', 'violet', 'purple', 'pink'];

function DealCardImage({dealName, minHeight, fontSize}) {
    function dealColor(name) {
        if (!name) name = '';
        return COLORS[Math.floor(name.length % COLORS.length)];
    }

    return (
        <Segment style={{minHeight, display: 'flex'}} inverted color={dealColor(dealName)} vertical>
            <Header style={{margin: 'auto auto', fontSize}}>{dealName}</Header>
        </Segment>
    );
}

DealCardImage.propTypes = {
    dealName: PropTypes.string,
    minHeight: PropTypes.number,
    fontSize: PropTypes.number
};

Analytics.autoTrack('session', {
    enable: true
});

Analytics.autoTrack('pageView', {
    enable: true,
    type: 'SPA'
});

Analytics.autoTrack('event', {
    enable: true
});

function DealCreation() {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [name, setName] = React.useState();
    const [category, setCategory] = React.useState();

    function handleOpen() {
        Analytics.record({ name: 'createDeal-start'});
        handleReset();
        setModalOpen(true);
    };

    function handleReset() {
        setName(faker.address.city())
        setCategory(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);
    }

    function handleClose() {
        setModalOpen(false);
    };

    async function handleSave(event) {
        event.preventDefault();
        await API.graphql({query: mutations.createDeal, variables: { input: { name, category }}, authMode:"AMAZON_COGNITO_USER_POOLS"});
        handleClose();
    };

    const options = CATEGORIES.map(c => ({ key: c, value: c, text: c}));

    return (
        <Modal
            closeIcon
            size='small'
            open={modalOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            trigger={<p><Icon name='plus'/>Create new Deal</p>}>
            <Modal.Header>Create new Deal</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label>Deal Name</label>
                        <Input fluid type='text' placeholder='Set Name' name='name' value={name || ''}
                               onChange={(e) => { setName(e.target.value); } }/>
                    </Form.Field>
                    <Form.Field>
                        <label>Category</label>
                        <Dropdown fluid placeholder='Select Category' selection options={options} value={category}
                                  onChange={(e, data) => { setCategory(data.value); } }/>
                    </Form.Field>
                    {name ? (
                        <DealCardImage dealName={name} minHeight={320} fontSize={48}/>
                    ) : (
                        <Segment style={{minHeight: 320}} secondary/>
                    )}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button content='Cancel' onClick={handleClose}/>
                <Button primary labelPosition='right' content='Reset' icon='refresh' onClick={handleReset}/>
                <Button positive labelPosition='right' icon='checkmark' content='Save' href='/'
                        disabled = {!(name && category)}
                        onClick={handleSave}
                        data-amplify-analytics-on='click'
                        data-amplify-analytics-name='createDeal-complete'
                        data-amplify-analytics-attrs={`category:${category}`}/>

            </Modal.Actions>
        </Modal>
    );
};

function DealsListCardGroup({ items, pageViewOrigin, cardStyle }) {
    function dealCards() {
            return items
                .map(deal =>
                    <Card
                        key={deal.id}
                        as={Link} to={{ pathname: `/deals/${deal.id}`, state: { pageViewOrigin } }}
                        style={cardStyle}>

                        <DealCardImage dealName={deal.name} minHeight={140} fontSize={24}/>
                        <Card.Content>
                            <Card.Header>{deal.name}</Card.Header>
                            <Card.Meta><Icon name='tag'/> {deal.category}</Card.Meta>
                        </Card.Content>
                    </Card>
                );
        };

    return (
        <Card.Group centered>
            {dealCards()}
        </Card.Group>
    );
};

DealsListCardGroup.propTypes = {
    items: PropTypes.array,
    pageViewOrigin: PropTypes.string,
    cardStyle: PropTypes.object
};

function DealsList() {
    const [deals, setDeals] = React.useState([]);
    React.useEffect(() => {
        async function fetchData () {
            const result = await API.graphql({query:queries.listDeals, variables:{limit:1000}, authMode:"AMAZON_COGNITO_USER_POOLS"});
            const deals = result.data.listDeals.items;
            setDeals(deals);
        }
        fetchData();
    }, []);

    React.useEffect(() => {
        let dealSubscription;
        async function fetchData() {
            dealSubscription = await API.graphql({query:subscriptions.onCreateDeal, authMode:"AMAZON_COGNITO_USER_POOLS"}).subscribe({
                next: (dealData) => {
                    console.log(dealData);
                    const newDeal = dealData.value.data.onCreateDeal;
                    setDeals([...deals, newDeal]);
                }
            });
        }
        fetchData();

        return () => {
            if (dealSubscription) {
                dealSubscription.unsubscribe();
            }
        };
    });

    document.title = 'Travel Deals';
    return (
        <Container style={{ marginTop: 70 }}>
            <DealsListCardGroup items={deals} pageViewOrigin='Browse'/>
        </Container>
    );
};

function DealDetails() {
    let params = useParams();
    let location = useLocation

    const id = params.dealId;
    const locationState = location.state;
    const [deal, setDeal] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadDealInfo() {
            const dealResult = await API.graphql({query:queries.getDeal, variables:{ id }, authMode:"AMAZON_COGNITO_USER_POOLS"});
            const deal = dealResult.data.getDeal;
            setDeal(deal);
            setLoading(false);
            document.title = `${deal.name} - Travel Deals`;
        };
        loadDealInfo();

        return () => {
            setDeal({});
            setLoading(true);
        };
    }, [id, locationState]);

    return (
        <Container>
            <NavLink to='/'><Icon name='arrow left'/>Back to Deals list</NavLink>
            <Divider hidden/>
            <Card key={deal.id} style={{ width: '100%', maxWidth: 720, margin: 'auto' }}>
                {loading ? (
                    <Placeholder fluid style={{minHeight: 320}}>
                        <Placeholder.Image/>
                    </Placeholder>
                ) : (
                    <DealCardImage dealName={deal.name} minHeight={320} fontSize={48}/>
                )}
                {loading ? (
                    <Placeholder>
                        <Placeholder.Line/>
                        <Placeholder.Line/>
                    </Placeholder>
                ) : (
                    <Card.Content>
                        <Card.Header>{deal.name}</Card.Header>
                        <Card.Meta><Icon name='tag'/> {deal.category}</Card.Meta>
                    </Card.Content>
                )}

            </Card>
            <Divider hidden/>
        </Container>
    );
};

DealDetails.propTypes = {
    id: PropTypes.string,
    locationState: PropTypes.object
};

function SampleGraph() {
    return <Container>
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <Item>
                   <PlaceholderContainer/>
                </Item>
            </Grid>
            <Grid item xs={4}>
                <Item><PlaceholderContainer/></Item>
            </Grid>
        </Grid>
        <Grid container spacing={3}>
            <Grid item xs>
                <Item><SampleBarSeries/></Item>
            </Grid>
            <Grid item xs>
                <Item><PlaceholderContainer/></Item>
            </Grid>
        </Grid>
    </Container>
}

function SampleBarSeries() {
    const timestamp = new Date('May 23 2017').getTime();
    const ONE_DAY = 86400000;
    const DATA = [
        {x0: ONE_DAY * 1 - (ONE_DAY * 1)/4, x: ONE_DAY * 1, y: 1},
        {x0: ONE_DAY * 2, x: ONE_DAY * 2, y: 1},
        {x0: ONE_DAY * 3, x: ONE_DAY * 3, y: 1},
        {x0: ONE_DAY * 4, x: ONE_DAY * 4, y: 2},
        {x0: ONE_DAY * 4, x: ONE_DAY * 5, y: 2.2},
        {x0: ONE_DAY * 5, x: ONE_DAY * 6, y: 1},
        {x0: ONE_DAY * 6, x: ONE_DAY * 7, y: 2.5},
        {x0: ONE_DAY * 7, x: ONE_DAY * 8, y: 1}
    ].map(el => ({x0: el.x0 + timestamp, x: el.x + timestamp, y: el.y}));

    return <XYPlot
        xDomain={[timestamp, timestamp + 10 * ONE_DAY]}
        yDomain={[0.1, 2.1]}
        xType="time"
        width={500}
        height={500}
    >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalRectSeries data={DATA} style={{stroke: '#fff'}} />
    </XYPlot>
}

function PlaceholderContainer() {
    return  <Container style={{width:500,height:500,border:'4px dotted blue'}}></Container>
}

function App({ signOut, user }) {
    return (
        <>
      <div className='App'>
          <Router>
              <Menu fixed='top' color='teal' inverted>
                  <Menu.Menu>
                      <Menu.Item header href='/'><Icon name='globe'/>Travel Deals</Menu.Item>
                  </Menu.Menu>
                  <Menu.Menu position='right'>
                      <Menu.Item link><DealCreation/></Menu.Item>
                      <Dropdown item simple text={user.username}>
                          <Dropdown.Menu>
                              <Dropdown.Item onClick={() => signOut()}><Icon name='power off'/>Log Out</Dropdown.Item>
                          </Dropdown.Menu>
                      </Dropdown>
                  </Menu.Menu>
              </Menu>

              <Container style={{ marginTop: 70 }}>
                  <Routes>
                  <Route path='/' exact element={
                      <SampleGraph/>

                  }/>
                  <Route path='/deals/:dealId' element={
                      <DealDetails/>
                  }/>
                  <Route path='/deals' element={
                      <DealsList/>
                  }/>
                  </Routes>
              </Container>
          </Router>
      </div>
        </>
  );
}

export default withAuthenticator(App);