import * as actionTypes from './actionTypes'

export function getUserHighLight(page, perPage) {
    return {
        type: actionTypes.FETCHING_USER_HIGHLIGHT,
        page: page,
        perPage: perPage
    }
}

export function getUserHighLightSuccess(data, page) {
    return {
        type: actionTypes.FETCH_USER_HIGHLIGHT_SUCCESS,
        data: data.viewer.userhighlightPagination.items,
        page: page
    }
}

export function getUserHighLightFailure(error) {
    return {
        type: actionTypes.FETCH_USER_HIGHLIGHT_FAILURE,
        errorMessage: error
    }
}
