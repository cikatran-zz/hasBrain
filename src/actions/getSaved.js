import * as actionTypes from './actionTypes'

export function getSaved(page, perPage) {
    return {
        type: actionTypes.FETCHING_SAVED,
        page: page,
        perPage: perPage
    }
}

export function getSavedSuccess(data, page) {
    return {
        type: actionTypes.FETCH_SAVED_SUCCESS,
        data: data.viewer.userbookmarkPagination.items,
        page: page
    }
}

export function getSavedFailure(error) {
    return {
        type: actionTypes.FETCH_SAVED_FAILURE,
        errorMessage: error
    }
}
