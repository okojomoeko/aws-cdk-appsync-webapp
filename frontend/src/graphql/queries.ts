/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getPost = /* GraphQL */ `query GetPost {
  getPost {
    id
    userId
    title
    content
    toUserId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPostQueryVariables, APITypes.GetPostQuery>;
export const listPostsByUserId = /* GraphQL */ `query ListPostsByUserId($input: ListPostsByUserIdInput!) {
  listPostsByUserId(input: $input) {
    posts {
      id
      userId
      title
      content
      toUserId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPostsByUserIdQueryVariables,
  APITypes.ListPostsByUserIdQuery
>;
