import * as actionTypes from './actionTypes';

export function getArticles(page, perPage) {
    return {
        type: actionTypes.FETCHING_ARTICLE,
        page: page,
        perPage: perPage
    }
}

export function getArticlesSuccess(data, page) {
    return {
        type: actionTypes.FETCH_ARTICLE_SUCCESS,
        data: data.viewer.articleRecommend.items,
        page: page
    }
}


export function getArticleFailure(error) {
    return {
        type: actionTypes.FETCH_ARTICLE_FAILURE,
        errorMessage: error
    }
}