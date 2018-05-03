import gql from "graphql-tag";

const articles = gql`
query {
  viewer{
    articlePagination(page: 1, perPage: 20) {
      count
      items {
        title
        longDescription
        shortDescription
        url
        state
        custom
        sourceId
        sourceName
        author
        sourceCreateAt
        createdAt
        updatedAt
        projectId
      }
    }
  }
}
`;

export default {
    serverURL: 'http://contentkit-prod.ap-southeast-1.elasticbeanstalk.com/graphql',
    authenKeyContentKit: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiI1YWRmNzRjNzdmZjQ0ZTAwMWViODI1MzkiLCJpYXQiOjE1MjQ1OTM4NjN9.Yx-17tVN1hupJeVa1sknrUKmxawuG5rx3cr8xZc7EyY',
    authenKeyHasbrain: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYjMzNzI1ZTZlOTFlMGNlMDk4OWRlNCIsImlhdCI6MTUxNjIzOTAyMn0.anJXLAhnRxz37NxmiKtzk76KBZCH1RQXV1DuQCy1wMc',
    queries: {
        articles: articles
    }
};
