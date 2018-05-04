import gql from "graphql-tag";

const articles = gql`
query getArticles($page: Int!, $perPage: Int!){
  viewer{
    articlePagination(page: $page, perPage: $perPage) {
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

const playlist = gql`
query {
  viewer{
    playlistOne {
      title
      longDescription
      shortDescription
      state
      createdAt
      updatedAt
      projectId
      mediaData
    } 
  }
}
`;

export default {
    serverURL: 'http://contentkit-prod.ap-southeast-1.elasticbeanstalk.com/graphql',
    hasBrainURL: 'http://hasbrain-api.mstage.io/',
    hasBrainHeader: {
        'x-hasbrain-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYjMzNzI1ZTZlOTFlMGNlMDk4OWRlNCIsImlhdCI6MTUxNjIzOTAyMn0.anJXLAhnRxz37NxmiKtzk76KBZCH1RQXV1DuQCy1wMc'
    },
    authenKeyContentKit: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiI1YWRmNzRjNzdmZjQ0ZTAwMWViODI1MzkiLCJpYXQiOjE1MjQ1OTM4NjN9.Yx-17tVN1hupJeVa1sknrUKmxawuG5rx3cr8xZc7EyY',
    authenKeyHasbrain: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYjMzNzI1ZTZlOTFlMGNlMDk4OWRlNCIsImlhdCI6MTUxNjIzOTAyMn0.anJXLAhnRxz37NxmiKtzk76KBZCH1RQXV1DuQCy1wMc',
    queries: {
        articles: articles,
        playlist: playlist
    },
    endPoints: {
        highlight: 'highlight?profile_id=',
        bookmark: 'bookmark?profile_id='
    }
};
