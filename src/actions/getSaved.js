import * as actionTypes from './actionTypes'

export function getSaved() {
    return {
        type: actionTypes.FETCHING_SAVED
    }
}

export function getSavedSuccess(data) {
    return {
        type: actionTypes.FETCH_SAVED_SUCCESS,
        data: data.result
    }
}

export function getSavedFailure(error) {
    return {
        type: actionTypes.FETCH_SAVED_FAILURE,
        errorMessage: error
    }
}
