import * as actionTypes from './actionTypes';

export function getHighlightByArticle(id) {
    return {
        type: actionTypes.FETCHING_HIGHLIGHT_ARTICLE,
        id: id,
    }
}

export function getHighlightByArticleSuccess(data) {
    return {
        type: actionTypes.FETCH_HIGHLIGHT_ARTICLE_SUCCESS,
        data: data.viewer.userhighlightOne
    }
}


export function getHighlightByArticleFailure(error) {
    return {
        type: actionTypes.FETCH_HIGHLIGHT_ARTICLE_FAILURE,
        errorMessage: error
    }
}

export function removeHighlightByArticle() {
    return {
        type: actionTypes.FETCH_HIGHLIGHT_ARTICLE_SUCCESS,
        data: null
    }
}