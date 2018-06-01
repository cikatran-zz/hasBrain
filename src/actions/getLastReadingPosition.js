import * as actionTypes from './actionTypes'

export function getLastReadingPosition() {
    return {
        type: actionTypes.FETCHING_LAST_READING_POSITION
    }
}

export function getLastReadingPositionSuccess(data) {
    return {
        type: actionTypes.FETCH_LAST_READING_POSITION_SUCCESS,
        data: data
    }
}

export function getLastReadingPositionFailure(error) {
    return {
        type: actionTypes.FETCH_LAST_READING_POSITION_FAILURE,
        errorMessage: error
    }
}
