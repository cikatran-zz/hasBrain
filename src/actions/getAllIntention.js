import * as actionTypes from './actionTypes';

export function getAllIntents() {
    return {
        type: actionTypes.FETCHING_ALL_INTENT
    }
}

export function getAllIntentsSuccess(data) {
    return {
        type: actionTypes.FETCH_ALL_INTENT_SUCCESS,
        data: data.viewer.intentMany,
    }
}


export function getAllIntentsFailure(error) {
    return {
        type: actionTypes.FETCH_ALL_INTENT_FAILURE,
        errorMessage: error
    }
}