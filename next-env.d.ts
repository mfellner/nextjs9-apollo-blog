/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '@blog/schema' {
  import { GraphQLSchema } from 'graphql';

  export const schema: GraphQLSchema;
}
