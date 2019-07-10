import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { SchemaLink } from 'apollo-link-schema';
import { GraphQLSchema } from 'graphql/type/schema';
import fetch from 'isomorphic-unfetch';

type Args = {
  schema?: GraphQLSchema;
  initialState?: NormalizedCacheObject;
};

const isServer = typeof window === 'undefined';
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

function createLink(schema?: GraphQLSchema) {
  if (schema) {
    return new SchemaLink({ schema });
  }
  return new HttpLink({
    uri: '/api/graphql',
    fetch
  });
}

function createNewClient({ schema, initialState }: Args) {
  const link = createLink(schema);
  const cache = new InMemoryCache().restore(initialState);

  return new ApolloClient({
    link,
    cache,
    ssrMode: isServer
  });
}

export function getApolloClient(args: Args = {}) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (isServer) {
    return createNewClient(args);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    console.log('new apolloClient');
    apolloClient = createNewClient(args);
  }
  console.log('reuse apolloClient');

  return apolloClient;
}
