import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import NextApp, { AppInitialProps, AppProps } from 'next/app';
import Head from 'next/head';
import React, { ComponentType } from 'react';
import { getDataFromTree } from 'react-apollo';
import { getApolloClient } from './apollo-client';

export type WithApolloProps = {
  apolloClient: ApolloClient<unknown>;
};

type NextAppComponentType = typeof NextApp;
type GetInitialPropsFn = NextAppComponentType['getInitialProps'];
type AppComponentType = ComponentType<AppInitialProps & WithApolloProps> & NextAppComponentType;
type WithApolloComponentProps = { apolloState: NormalizedCacheObject };

export default function withApollo(App: AppComponentType) {
  const isServer = typeof window === 'undefined';

  return class WithApollo extends React.Component<AppProps & WithApolloComponentProps> {
    public static displayName = 'withApollo(App)';

    public static getInitialProps: GetInitialPropsFn = async ctx => {
      const { Component, router } = ctx;

      const appProps: AppInitialProps = await App.getInitialProps(ctx);

      let apolloState: NormalizedCacheObject = {};

      if (isServer) {
        const { schema } = await import('@blog/schema');
        const apolloClient = getApolloClient({ schema });

        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App {...appProps} Component={Component} router={router} apolloClient={apolloClient} />
          );
          // Extract query data from the Apollo store
          apolloState = apolloClient.extract();
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error);
        }
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      const initialProps: AppInitialProps & WithApolloComponentProps = {
        ...appProps,
        apolloState
      };

      return initialProps;
    };

    private readonly apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(props: AppProps & WithApolloComponentProps) {
      super(props);
      this.apolloClient = getApolloClient({ initialState: props.apolloState });
    }

    public render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
}
