import gql from "graphql-tag";

const articles = gql`
query getArticles($page: Int!, $perPage: Int!){
  viewer{
    articleRecommend(page: $page, perPage: $perPage) {
      count
      items {
        _id
        title
        longDescription
        shortDescription
        url
        state
        custom
        sourceId
        sourceName
        sourceImage
        author
        sourceCreateAt
        createdAt
        updatedAt
        projectId
        originalImages {
          height
          width
          url
          name
          fileName
        }
        readingTime
      }
    }
  }
}
`;

const getBookmark = gql`
query getBookmark($page: Int, $perPage: Int){
  viewer{
    userbookmarkPagination(page: $page, perPage: $perPage) {
      count
      items {
        _id
        article {
          _id
          url
          title
          longDescription
          shortDescription
          readingTime
          state
          custom
          author
          sourceId
          sourceName
          sourceImage
          sourceCreateAt
          createdAt
          updatedAt
          projectId
          readingTime
          originalImages {
            height
            width
            url
            name
            fileName
          }
        }
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

const postBookmark = gql`
mutation bookmark($id: MongoID){
  user{
    userbookmarkCreate(record:{
      articleId: $id
    }) {
      recordId
    }
  }
}
`;

const postUnbookmark = gql`
mutation removeBookmark($id: MongoID){
  user{
    userbookmarkRemoveOne(filter: {
      _id: $id
    }) {
      recordId
    }
  }
}
`;

const postCreateUser = gql`
mutation createUser($profileId: MongoID, $name: String) {
  user{
    userCreate(record: {
      profileId: $profileId,
      name: $name
    }) {
      recordId
    }
  }
}
`;

const onboardingInfo = gql`
query {
  viewer {
    personaPagination {
      count
      items {
        _id
        title
      }
    }
    levelPagination {
      count
      items {
        _id
        title
      }
    }
    intentPagination {
      count
      items {
        _id
        title
      }
    }
  }
}
`;

const postUserInterest = gql`
mutation postUserInterest($segments: [UsertypeusertypeSegmentsInput], $intentIds: [MongoID]){
  user{
    userInterest(record:{
      segments: $segments,
      intentIds: $intentIds
    }) {
      recordId
    }
  }
}
`;

export default {
    serverURL: 'https://contentkit-api.mstage.io/graphql',
    authenKeyContentKit: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiI1YWRmNzRjNzdmZjQ0ZTAwMWViODI1MzkiLCJpYXQiOjE1MjQ1OTM4NjN9.Yx-17tVN1hupJeVa1sknrUKmxawuG5rx3cr8xZc7EyY',
    queries: {
        articles: articles,
        playlist: playlist,
        bookmark: getBookmark,
        onboardingInfo: onboardingInfo
    },
    mutation: {
        bookmark: postBookmark,
        unbookmark: postUnbookmark,
        createUser: postCreateUser,
        userInterest: postUserInterest
    }
};
