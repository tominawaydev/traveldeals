import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Icon, Menu, Dropdown } from 'semantic-ui-react'
import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App({ signOut, user }) {
  return (
      <>
          <div className='App'>
              <Menu fixed='top' color='teal' inverted>
                  <Menu.Menu>
                      <Menu.Item header href='/'><Icon name='globe'/>Travel Deals</Menu.Item>
                  </Menu.Menu>
                  <Menu.Menu position='right'>
                      <Dropdown item simple text={user.username}>
                          <Dropdown.Menu>
                              <Dropdown.Item onClick={() => signOut()}><Icon name='power off'/>Log Out</Dropdown.Item>
                          </Dropdown.Menu>
                      </Dropdown>
                  </Menu.Menu>
              </Menu>

          </div>
      </>



  );
}

export default withAuthenticator(App);