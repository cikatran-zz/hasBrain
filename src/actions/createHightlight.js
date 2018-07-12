import * as actionTypes from './actionTypes';

export function createHighlight(articleId, highlightedText, position, comment, note, dispatch) {
    return {
        type: actionTypes.CREATING_USER_HIGHLIGHT,
        articleId: articleId,
        highlight: highlightedText,
        position: position,
        comment: comment,
        note: note,
        dispatcher: dispatch
    }
}

export function createHighlightSuccess() {
    return {
        type: actionTypes.CREATE_USER_HIGHLIGHT_SUCCESS
    }
}


export function createHighlightFailure(error) {
    return {
        type: actionTypes.CREATE_USER_HIGHLIGHT_FAILURE,
        errorMessage: error
    }
}