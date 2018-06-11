import * as actionTypes from './actionTypes';

export function getPathBookmarked(page, perPage) {
    return {
        type: actionTypes.FETCHING_PATH_BOOKMARKED,
        page: page,
        perPage: perPage
    }
}

export function getPathBookmarkedSuccess(data, page) {
    return {
        type: actionTypes.FETCH_PATH_BOOKMARKED_SUCCESS,
        data: data.viewer.userbookmarkPagination.items,
        page: page
    }
}


export function getPathBookmarkedFailure(error) {
    return {
        type: actionTypes.FETCH_PATH_BOOKMARKED_FAILURE,
        errorMessage: error
    }
}