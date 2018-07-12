import * as actionTypes from './actionTypes';
import _ from 'lodash';

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

export function removeArticleDetail() {
    return {
        type: actionTypes.FETCH_ARTICLE_DETAIL_SUCCESS,
        data: null
    }
}

export function getArticleDetailByUrl(url) {
    return {
        type: actionTypes.FETCHING_ARTICLE_DETAIL_BY_URL,
        url: url,
    }
}

export function getArticleDetailByUrlSuccess(data) {
    return {
        type: actionTypes.FETCH_ARTICLE_DETAIL_SUCCESS,
        data: _.get(data, 'user.articleCreateIfNotExist.record')
    }
}