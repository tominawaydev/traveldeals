/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDeal = /* GraphQL */ `
  mutation CreateDeal(
    $input: CreateDealInput!
    $condition: ModelDealConditionInput
  ) {
    createDeal(input: $input, condition: $condition) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateDeal = /* GraphQL */ `
  mutation UpdateDeal(
    $input: UpdateDealInput!
    $condition: ModelDealConditionInput
  ) {
    updateDeal(input: $input, condition: $condition) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteDeal = /* GraphQL */ `
  mutation DeleteDeal(
    $input: DeleteDealInput!
    $condition: ModelDealConditionInput
  ) {
    deleteDeal(input: $input, condition: $condition) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createFaceValue = /* GraphQL */ `
  mutation CreateFaceValue(
    $input: CreateFaceValueInput!
    $condition: ModelFaceValueConditionInput
  ) {
    createFaceValue(input: $input, condition: $condition) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateFaceValue = /* GraphQL */ `
  mutation UpdateFaceValue(
    $input: UpdateFaceValueInput!
    $condition: ModelFaceValueConditionInput
  ) {
    updateFaceValue(input: $input, condition: $condition) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteFaceValue = /* GraphQL */ `
  mutation DeleteFaceValue(
    $input: DeleteFaceValueInput!
    $condition: ModelFaceValueConditionInput
  ) {
    deleteFaceValue(input: $input, condition: $condition) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
