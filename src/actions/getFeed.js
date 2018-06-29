import * as actionTypes from './actionTypes';

export function getFeed(page, perPage, rank) {
    return {
        type: actionTypes.FETCHING_FEED,
        page: page,
        perPage: perPage,
        rank: rank
    }
}

export function getFeedSuccess(data, page, rank) {
    return {
        type: actionTypes.FETCH_FEED_SUCCESS,
        data: data.viewer.feedPagination.items,
        rank: rank,
        count: data.viewer.feedPagination.count
    }
}


export function getFeedFailure(error) {
    return {
        type: actionTypes.FETCH_FEED_FAILURE,
        errorMessage: error
    }
}