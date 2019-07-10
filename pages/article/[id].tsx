import gql from 'graphql-tag';
import { WithRouterProps } from 'next/dist/client/with-router';
import { withRouter } from 'next/router';
import { Query } from 'react-apollo';
import { Article } from '../../lib/types';
import Error from 'next/error';
import Link from 'next/link';

function ArticlePage({ router }: WithRouterProps) {
  const id: string = router.query.id as string;

  return (
    <article>
      <Query<
        {
          article: Article | null;
        },
        { id: string }
      >
        query={gql`
          query article($id: String!) {
            article(id: $id) {
              id
              title
              body
            }
          }
        `}
        variables={{ id }}
      >
        {({ error, loading, data: { article } }) => {
          if (error) {
            return <p>Error: {error.message}</p>;
          }
          if (loading) {
            return <p>loading…</p>;
          }
          if (!article) {
            return <Error title="This page could not be found." statusCode={404} />;
          }
          return (
            <>
              <h1 key={article.id}>{article.title}</h1>
              <section>{article.body}</section>
            </>
          );
        }}
      </Query>
      <p>
        <Link href="/">
          <a>go home</a>
        </Link>
      </p>
    </article>
  );
}

export default withRouter(ArticlePage);
