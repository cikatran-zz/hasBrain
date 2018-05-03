import * as actionTypes from './actionTypes';

export function getArticles(page, perPage) {
    return {
        type: actionTypes.FETCHING_ARTICLE,
        page: page,
        perPage: perPage
    }
}

export function getArticlesSuccess(data) {
    return {
        type: actionTypes.FETCH_ARTICLE_SUCCESS,
        data: data.viewer.articlePagination.items
    }
}


export function getArticleFailure(error) {
    return {
        type: actionTypes.FETCH_ARTICLE_FAILURE,
        errorMessage: error
    }
}