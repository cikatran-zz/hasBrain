import * as actionTypes from './actionTypes'

export function getUserPath() {
    return {
        type: actionTypes.FETCHING_USER_PATH,
    }
}

export function getUserPathSuccess(data) {
    return {
        type: actionTypes.FETCH_USER_PATH_SUCCESS,
        data: data.viewer.listOne,
    }
}

export function getUserPathFailure(error) {
    return {
        type: actionTypes.FETCH_USER_PATH_FAILURE,
        errorMessage: error
    }
}
