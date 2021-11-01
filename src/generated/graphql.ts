import { GraphQLClient } from "graphql-request";
import { RequestInit } from "graphql-request/dist/types.dom";
import { useQuery, UseQueryOptions } from "react-query";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};

function fetcher<TData, TVariables>(
    client: GraphQLClient,
    query: string,
    variables?: TVariables,
    headers?: RequestInit["headers"],
) {
    return async (): Promise<TData> =>
        client.request<TData, TVariables>(query, variables, headers);
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};

export type Golfers = {
    __typename?: "Golfers";
    attending__D?: Maybe<Scalars["String"]>;
    firstName__B?: Maybe<Scalars["String"]>;
    greenJacketOwner__G?: Maybe<Scalars["String"]>;
    paid__E?: Maybe<Scalars["String"]>;
    secondName__A?: Maybe<Scalars["String"]>;
    tieColour__H?: Maybe<Scalars["String"]>;
    tieNeeded__F?: Maybe<Scalars["String"]>;
    year__C?: Maybe<Scalars["Float"]>;
};

/**
 * PageInfo indicates if more results are available in a connection.
 * See *GraphQL Cursor Connections Specification*
 */
export type PageInfo = {
    __typename?: "PageInfo";
    /** Cursor corresponding to the last node in edges */
    endCursor: Scalars["String"];
    /** Indicates whether more edges exist following the set defined by the pagination arguments. */
    hasNextPage: Scalars["Boolean"];
    /** Indicates whether more edges exist prior to the set defined by the pagination arguments. */
    hasPreviousPage: Scalars["Boolean"];
    /** Cursor corresponding to the first node in edges */
    startCursor: Scalars["String"];
};

/**
 * Query root object type.
 *
 * Contains fields that are available at the top level of a GraphQL `query`.
 *
 * If an operation is a `query`, the result of the operation is the result of
 * executing the query’s top level selection set with the `Query` root object type.
 */
export type Query = {
    __typename?: "Query";
    golfers?: Maybe<Array<Maybe<Golfers>>>;
};

/**
 * Query root object type.
 *
 * Contains fields that are available at the top level of a GraphQL `query`.
 *
 * If an operation is a `query`, the result of the operation is the result of
 * executing the query’s top level selection set with the `Query` root object type.
 */
export type QueryGolfersArgs = {
    q?: Scalars["String"];
};

export type Get_GolfersQueryVariables = Exact<{ [key: string]: never }>;

export type Get_GolfersQuery = {
    __typename?: "Query";
    golfers?:
        | Array<
              | {
                    __typename?: "Golfers";
                    secondName__A?: string | null | undefined;
                    firstName__B?: string | null | undefined;
                    year__C?: number | null | undefined;
                    attending__D?: string | null | undefined;
                    paid__E?: string | null | undefined;
                    tieNeeded__F?: string | null | undefined;
                    greenJacketOwner__G?: string | null | undefined;
                    tieColour__H?: string | null | undefined;
                }
              | null
              | undefined
          >
        | null
        | undefined;
};

export const Get_GolfersDocument = `
    query GET_GOLFERS {
  golfers(q: "Select *") {
    secondName__A
    firstName__B
    year__C
    attending__D
    paid__E
    tieNeeded__F
    greenJacketOwner__G
    tieColour__H
  }
}
    `;
export const useGet_GolfersQuery = <TData = Get_GolfersQuery, TError = unknown>(
    client: GraphQLClient,
    variables?: Get_GolfersQueryVariables,
    options?: UseQueryOptions<Get_GolfersQuery, TError, TData>,
    headers?: RequestInit["headers"],
) =>
    useQuery<Get_GolfersQuery, TError, TData>(
        variables === undefined ? ["GET_GOLFERS"] : ["GET_GOLFERS", variables],
        fetcher<Get_GolfersQuery, Get_GolfersQueryVariables>(
            client,
            Get_GolfersDocument,
            variables,
            headers,
        ),
        options,
    );
useGet_GolfersQuery.document = Get_GolfersDocument;

useGet_GolfersQuery.getKey = (variables?: Get_GolfersQueryVariables) =>
    variables === undefined ? ["GET_GOLFERS"] : ["GET_GOLFERS", variables];
