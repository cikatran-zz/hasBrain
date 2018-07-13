import * as actionTypes from './actionTypes';

export function removeHighlight(articleId, highlightId, dispatch) {
    return {
        type: actionTypes.REMOVING_HIGHLIGHT,
        articleId: articleId,
        highlightId: highlightId,
        dispatcher: dispatch
    }
}

export function removeHighlightSuccess(articleId) {

    return {
        type: actionTypes.REMOVE_HIGHLIGHT_SUCCESS,
        articleId: articleId
    }
}


export function removeHighlightFailure(error) {
    return {
        type: actionTypes.REMOVE_HIGHLIGHT_FAILURE,
        errorMessage: error
    }
}