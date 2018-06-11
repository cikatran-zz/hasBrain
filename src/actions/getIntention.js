import * as actionTypes from './actionTypes';

export function getIntents(segments) {
    return {
        type: actionTypes.FETCHING_INTENT,
        segments: segments
    }
}

export function getIntentsSuccess(data) {
    return {
        type: actionTypes.FETCH_INTENT_SUCCESS,
        data: data.viewer.intentMany,
    }
}


export function getIntentsFailure(error) {
    return {
        type: actionTypes.FETCH_INTENT_FAILURE,
        errorMessage: error
    }
}