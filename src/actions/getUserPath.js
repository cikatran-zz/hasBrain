import * as actionTypes from './actionTypes'

export function getUserPath(id) {
    return {
        type: actionTypes.FETCHING_USER_PATH,
        pathId: id
    }
}

export function getUserPathSuccess(data) {
    return {
        type: actionTypes.FETCH_USER_PATH_SUCCESS,
        data: data.viewer.pathOne,
    }
}

export function getUserPathFailure(error) {
    return {
        type: actionTypes.FETCH_USER_PATH_FAILURE,
        errorMessage: error
    }
}
