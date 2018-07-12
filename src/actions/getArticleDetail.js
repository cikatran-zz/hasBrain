import * as actionTypes from './actionTypes';

export function getArticleDetail(id) {
    return {
        type: actionTypes.FETCHING_ARTICLE_DETAIL,
        id: id,
    }
}

export function getArticleDetailSuccess(data) {
    return {
        type: actionTypes.FETCH_ARTICLE_DETAIL_SUCCESS,
        data: data.viewer.articleOne
    }
}


export function getArticleDetailFailure(error) {
    return {
        type: actionTypes.FETCH_ARTICLE_DETAIL_FAILURE,
        errorMessage: error
    }
}