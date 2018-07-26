import * as actionTypes from './actionTypes';

export function createHighlight(data, dispatch) {
    return {
        type: actionTypes.CREATING_USER_HIGHLIGHT,
        data: data,
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