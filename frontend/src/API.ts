/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePostInput = {
  userId: string,
  title?: string | null,
  content?: string | null,
  toUserId?: string | null,
};

export type Post = {
  __typename: "Post",
  id: string,
  userId: string,
  title?: string | null,
  content?: string | null,
  toUserId?: string | null,
};

export type ListPostsByUserIdInput = {
  userId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostsByUserIdResponse = {
  __typename: "ListPostsByUserIdResponse",
  posts?:  Array<Post | null > | null,
  nextToken?: string | null,
};

export type CreatePostMutationVariables = {
  input: CreatePostInput,
};

export type CreatePostMutation = {
  createPost?:  {
    __typename: "Post",
    id: string,
    userId: string,
    title?: string | null,
    content?: string | null,
    toUserId?: string | null,
  } | null,
};

export type GetPostQueryVariables = {
};

export type GetPostQuery = {
  getPost?:  Array< {
    __typename: "Post",
    id: string,
    userId: string,
    title?: string | null,
    content?: string | null,
    toUserId?: string | null,
  } | null > | null,
};

export type ListPostsByUserIdQueryVariables = {
  input: ListPostsByUserIdInput,
};

export type ListPostsByUserIdQuery = {
  listPostsByUserId?:  {
    __typename: "ListPostsByUserIdResponse",
    posts?:  Array< {
      __typename: "Post",
      id: string,
      userId: string,
      title?: string | null,
      content?: string | null,
      toUserId?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreatePostSubscriptionVariables = {
  toUserId: string,
};

export type OnCreatePostSubscription = {
  onCreatePost?:  {
    __typename: "Post",
    id: string,
    userId: string,
    title?: string | null,
    content?: string | null,
    toUserId?: string | null,
  } | null,
};
