import gql from 'graphql-tag';
import Link from 'next/link';
import { Query } from 'react-apollo';
import { Article } from '../lib/types';

export default function Index() {
  return (
    <main>
      <Query<{
        articles: Pick<Article, 'id' | 'title'>[];
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
          return articles.map(article => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <a>
                <h1>{article.title}</h1>
              </a>
            </Link>
          ));
        }}
      </Query>
    </main>
  );
}
