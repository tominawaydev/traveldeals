/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDeal = /* GraphQL */ `
  query GetDeal($id: ID!) {
    getDeal(id: $id) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listDeals = /* GraphQL */ `
  query ListDeals(
    $filter: ModelDealFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDeals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        category
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getFaceValue = /* GraphQL */ `
  query GetFaceValue($id: ID!) {
    getFaceValue(id: $id) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listFaceValues = /* GraphQL */ `
  query ListFaceValues(
    $filter: ModelFaceValueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFaceValues(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        category
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
