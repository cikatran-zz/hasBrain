import * as actionTypes from './actionTypes';

export function getArticles(limit, skip, sources, tags) {
    return {
        type: actionTypes.FETCHING_ARTICLE,
        limit: limit,
        skip: skip,
        sources: sources,
        tags: tags
    }
}

export function getArticlesSuccess(data, skip) {
    return {
        type: actionTypes.FETCH_ARTICLE_SUCCESS,
        count:data.viewer.articleSearch.count,
        data: data.viewer.articleSearch.hits,
        skip: skip
    }
}


export function getArticleFailure(error) {
    return {
        type: actionTypes.FETCH_ARTICLE_FAILURE,
        errorMessage: error
    }
}