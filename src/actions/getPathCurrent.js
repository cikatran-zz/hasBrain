import * as actionTypes from './actionTypes';

export function getPathCurrent() {
    return {
        type: actionTypes.FETCHING_PATH_CURRENT,
    }
}

export function getPathCurrentSuccess(data) {
    return {
        type: actionTypes.FETCH_PATH_CURRENT_SUCCESS,
        data: data.viewer.pathSearchUser.hits,
    }
}


export function getPathCurrentFailure(error) {
    return {
        type: actionTypes.FETCH_PATH_CURRENT_FAILURE,
        errorMessage: error
    }
}