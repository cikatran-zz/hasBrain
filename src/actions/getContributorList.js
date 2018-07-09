import * as actionTypes from './actionTypes'

export function getContributorList() {
    return {
        type: actionTypes.FETCHING_CONTRIBUTOR_LIST,
    }
}

export function getContributorListSuccess(data) {
    return {
        type: actionTypes.FETCH_CONTRIBUTOR_LIST_SUCCESS,
        data: data,
    }
}

export function getContributorListFailure(error) {
    return {
        type: actionTypes.FETCH_CONTRIBUTOR_LIST_FAILURE,
        errorMessage: error
    }
}
