import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Article } from '../lib/types';

export default function Index() {
  return (
    <main>
      <Query<{
        articles: Article[];
      }>
        query={gql`
          query articles {
            articles {
              id
              title
            }
          }
        `}
      >
        {({ error, loading, data: { articles } }) => {
          if (error) {
            return <p>Error: {error.message}</p>;
          }
          if (loading) {
            return <p>loading…</p>;
          }
          return articles.map(article => <h1 key={article.id}>{article.title}</h1>);
        }}
      </Query>
    </main>
  );
}
