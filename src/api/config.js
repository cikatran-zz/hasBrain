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
        contentId
        state
        custom
        sourceId
        sourceName
        sourceImage
        author
        sourceCreatedAt
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
        tags
      }
    }
  }
}
`;

const getBookmark = gql`
query getBookmark($page: Int, $perPage: Int, $kind: String){
  viewer{
    userbookmarkPagination(filter: {
      kind: $kind
    }, page: $page, perPage: $perPage) {
      count
      items {
        _id
        content {
          _id
          contentId
          content
          title
          longDescription
          shortDescription
          readingTime
          state
          custom
          sourceImage
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
          tags
        }
      }
    }
  }
}

`;


const playlist = gql`
query{
  viewer {
    listOne(filter: {title: "Graphql Getting Started"}) {
      title
      longDescription
      shortDescription
      contentData {
        _id
        contentId
        content
        title
        longDescription
        shortDescription
        sourceImage
        state
        custom
        createdAt
        updatedAt
        projectId
        kind
        readingTime
        tags
        originalImages {
          height
          width
          url
          name
          fileName
          _id
        }
      }
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
      articleId: $id
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

const postHighlightedText = gql`
mutation highlightedText($articleId: MongoID, $highlightedText: String){
  user{
    userhighlightCreate(record: { articleId: $articleId, highlight: $highlightedText}) {
      recordId
    }
  }
}
`;

const onboardingInfo = gql`
query {
  viewer {
    personaMany {
      _id
      title
    }
    levelMany {
      _id
      title
    }
  }
}
`;

const postUserInterest = gql`
mutation postUserInterest($segments: [UsertypedevelopertypeSegmentsInput], $intentIds: [MongoID]){
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

const articleCreateIfNotExist = gql`
mutation checkAndCreateArticle($record: CreateOnearticletypeInput!) {
  user{
    articleCreateIfNotExist(record: $record) {
      recordId
      isBookmarked
      record {
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
        sourceCreatedAt
        createdAt
        updatedAt
        projectId
        content
        contentId
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


const getUserHighLight = gql`
    query getUserHighLight($page: Int, $perPage: Int) {
       viewer{
            userhighlightPagination(page:$page, perPage:$perPage) {
                count
                items {
                    articleId
                    highlight
                    state
                    article {
                        url
                        title
                    }
                }
            }
        }
    }`;

const getUserPath = gql`
query getUserPath($id: MongoID){
  viewer {
    pathOne(filter: {_id: $id}) {
      title
      shortDescription
      contentData {
        contentId
        content
        readingTime
        title
        longDescription
        shortDescription
        sourceImage
        state
        custom
        createdAt
        updatedAt
        projectId
        type
        kind
        contentData {
          _id
          contentId
          content
          readingTime
          title
          longDescription
          shortDescription
          sourceImage
          state
          custom
          createdAt
          updatedAt
          projectId
          type
          kind
        }
      }
    }
  }
}
`;

const getPathRecommend = gql`
query pathRecommend($page: Int, $perPage: Int) {
  viewer {
    pathRecommend(page: $page, perPage: $perPage) {
      count
      items {
        _id
        privacy
        profileId
        contentId
        content
        readingTime
        title
        longDescription
        shortDescription
        sourceImage
        state
        custom
        createdAt
        updatedAt
        projectId
        type
        kind
      }
    }
	}
}
`;

const intentMany = gql`
query getIntent($segments: [PersonaLevel]) {
  viewer {
    intentMany(filter: {
      segments: $segments
    }) {
      intentType
      children {
        _id
        title
        intentType
        displayName
        createdAt
        updatedAt
        projectId
        recommended
      }
    }
  }
}
`;

const intentCreate = gql`
mutation createIntent($name: String) {
  user {
    intentCreate(record: {
      title: $name
			displayName: $name
    }) {
      recordId
      
    }
  }
}
`;

const createBookmark = gql`
mutation createBookmark($contentId: MongoID, $kind: String){
  user{
    userbookmarkCreate(record: {
      contentId: $contentId,
      kind: $kind
    }) {
      recordId
    }
  },
  
}
`;

const removeBookmark = gql`
mutation removeBookmark($contentId: MongoID, $kind: String){
  user{
    userbookmarkRemoveOne(filter: {
      contentId: $contentId,
      kind: $kind
    }) {
      recordId
    }
  }
}
`;

const getRecommendSource = gql`
query getRecommendSource($ids: [ID]!){
  viewer{
    sourceRecommend(_ids: $ids)
  }
}
`;

const getSourceList = gql`
    query{
        viewer{
            sourcePagination(page: 1, perPage: 100) {
                count
                items {
                    _id
                    title
                    sourceImage
                    sourceId
                    categories
                }
            }
         }
    }
`

const getExploreArticles = gql`
query getExploreArticles($skip: Int, $limit: Int, $sources: [JSON], $tags: [JSON]){
  viewer{
    articleSearch(sort: sourceCreatedAt__desc, query: {
      bool: {
        filter: [
          {
              terms: {
              sourceName: $sources
            }
          },
          {
            terms:{
              category: $tags
            }
          }
        ]
      }
    }, limit: $limit, skip: $skip) {
      count
      took
      hits {
        _id
        _source{
  		  title
          category
          author
          content
          contentId
          authorImage
          readingTime
          sourceImage
          sourceCreatedAt
          shortDescription
          tags
          sourceName
        }
      }
    }
  }
}
`;

export const getExploreArticlesQuery = (withSources, withTags) => {
    let query = `query getExploreArticles($skip: Int, $limit: Int`;
    if (withSources)  {
        query = `${query}, $sources: [JSON]`;
    }

    if (withTags) {
        query = `${query}, $tags: [JSON]`;
    }
    query = `${query} ){
  viewer{
    articleSearch(sort: sourceCreatedAt__desc,`
    if (!withSources && !withTags) {
        query = `${query} limit: $limit, skip: $skip) {
      count
      took
      hits {
        _id
        _source
  		  title
          category
          author
          content
          contentId
          authorImage
          readingTime
          sourceImage
          sourceCreatedAt
          shortDescription
          tags
          sourceName
        }
      }
    }
}`
    } else {
        query = `${query} query: {
      bool: {
        filter: [
          `
        if (withSources) {
            query = `${query} {
              terms: {
              sourceName: $sources
            }
          },`
        }

        if (withTags) {
            query = `${query} {
            terms:{
              category: $tags
            }
          }`
        }

        query = `${query} ]
      }
    }, limit: $limit, skip: $skip) {
      count
      took
      hits {
        _id
        _source
  		  title
          category
          author
          content
          contentId
          authorImage
          readingTime
          sourceImage
          sourceCreatedAt
          shortDescription
          tags
          sourceName
        }
      }
    }
  }`
    }

    return gql `${query}`;
}

const getCategory = gql`
query {
  viewer {
    categoryMany {
      title
    }
  }
}
`;

const getUserFollow = gql`
query getUserFollow($kind: EnumuserfollowtypeKind){
  viewer{
    userFollowMany(filter: {
      kind: $kind
    }) {
      sourceId
      kind
      state
      createdAt
      updatedAt
      profileId
      projectId
    }
  }
}
`

const updateUserFollow = gql`
mutation updateUserFollow($kind: String!, $sourceIds: [String]){
  user{
    followCreateMany(record: {
      kind: $kind,
      sourceIds: $sourceIds
    })
  }
}
`

export default {
    serverURL: 'https://contentkit-api.mstage.io/graphql',
    authenKeyContentKit: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiI1YWRmNzRjNzdmZjQ0ZTAwMWViODI1MzkiLCJpYXQiOjE1MjQ1OTM4NjN9.Yx-17tVN1hupJeVa1sknrUKmxawuG5rx3cr8xZc7EyY',
    queries: {
        articles: articles,
        playlist: playlist,
        bookmark: getBookmark,
        onboardingInfo: onboardingInfo,
        userHighlight: getUserHighLight,
        userPath: getUserPath,
        sourceList: getSourceList,
        exploreArticles: getExploreArticles,
        intents: intentMany,
        pathRecommend: getPathRecommend,
        sourceRecommend: getRecommendSource,
        category: getCategory,
        userFollow: getUserFollow
    },
    mutation: {
        bookmark: postBookmark,
        unbookmark: postUnbookmark,
        createUser: postCreateUser,
        userInterest: postUserInterest,
        articleCreateIfNotExist: articleCreateIfNotExist,
        highlightText: postHighlightedText,
        createIntent: intentCreate,
        createBookmark: createBookmark,
        removeBookmark: removeBookmark,
        updateUserFollow: updateUserFollow
    }
};
