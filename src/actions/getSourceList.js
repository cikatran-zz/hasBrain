import * as actionTypes from './actionTypes'

export function getSourceList() {
    return {
        type: actionTypes.FETCHING_SOURCE_LIST,
    }
}

export function getSourceListSuccess(data) {
    return {
        type: actionTypes.FETCH_SOURCE_LIST_SUCCESS,
        data: data.viewer.sourcePagination,
    }
}

export function getSourceListFailure(error) {
    return {
        type: actionTypes.FETCH_SOURCE_LIST_FAILURE,
        errorMessage: error
    }
}
