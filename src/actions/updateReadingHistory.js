import * as actionTypes from './actionTypes';

export function updateReadingHistory(articleId, scrollOffset, dispatch) {
    return {
        type: actionTypes.UPDATING_READING_HISTORY,
        articleId: articleId,
        scrollOffset: scrollOffset,
        dispatcher: dispatch
    }
}

export function updateReadingHistorySuccess() {
    return {
        type: actionTypes.UPDATE_READING_HISTORY_SUCCESS
    }
}


export function updateReadingHistoryFailure(error) {
    return {
        type: actionTypes.UPDATE_READING_HISTORY_FAILURE,
        errorMessage: error
    }
}