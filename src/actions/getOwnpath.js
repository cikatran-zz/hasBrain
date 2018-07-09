import * as actionTypes from './actionTypes';

export function getOwnpath() {
    return {
        type: actionTypes.FETCHING_OWNPATH
    }
}

export function getOwnpathSuccess(data) {
    return {
        type: actionTypes.FETCH_OWNPATH_SUCCESS,
        data: data.viewer.pathSearchUser.hits,
    }
}


export function getOwnpathFailure(error) {
    return {
        type: actionTypes.FETCH_OWNPATH_FAILURE,
        errorMessage: error
    }
}