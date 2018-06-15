import * as actionTypes from './actionTypes'

export function getWatchingHistory(id) {
    return {
        type: actionTypes.FETCHING_WATCHING_HISTORY,
        contentId: id
    }
}

export function getWatchingHistorySuccess(data) {
    return {
        type: actionTypes.FETCH_WATCHING_HISTORY_SUCCESS,
        data: data,
    }
}

export function getWatchingHistoryFailure(error) {
    return {
        type: actionTypes.FETCH_WATCHING_HISTORY_FAILURE,
        errorMessage: error
    }
}
