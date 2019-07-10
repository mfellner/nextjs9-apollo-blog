import { gql, makeExecutableSchema } from 'apollo-server-micro';
import { Article } from './types';

const typeDefs = gql`
  type Article {
    id: ID!
    title: String!
    body: String!
  }

  type Query {
    article(id: ID): Article!
    articles: [Article!]!
  }
`;

const articles: Article[] = [
  {
    id: '1',
    title: 'First article',
    body: 'This is my first article.'
  },
  {
    id: '2',
    title: 'Second article',
    body: 'This is just another article.'
  }
];

const resolvers = {
  Query: {
    article(parent, { id }, context) {
      return articles.find(article => article.id === id);
    },
    articles(parent, args, context) {
      return articles;
    }
  }
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
