import * as actionTypes from './actionTypes';

export function getCategory(segments) {
    return {
        type: actionTypes.FETCHING_CATEGORY,
        segments: segments
    }
}

export function getCategorySuccess(data) {
    return {
        type: actionTypes.FETCH_CATEGORY_SUCCESS,
        data: data.viewer.categoryMany,
    }
}


export function getCategoryFailure(error) {
    return {
        type: actionTypes.FETCH_CATEGORY_FAILURE,
        errorMessage: error
    }
}