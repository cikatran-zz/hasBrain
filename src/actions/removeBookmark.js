import * as actionTypes from './actionTypes';

export function removeBookmark(contentId, bookmarkType, trackingType, dispatch) {
    return {
        type: actionTypes.REMOVING_BOOKMARK,
        contentId: contentId,
        contentType: bookmarkType,
        trackingType: trackingType,
        dispatcher: dispatch
    }
}

export function removeBookmarkSuccess(contentId) {

    return {
        type: actionTypes.REMOVE_BOOKMARK_SUCCESS,
        contentId: contentId
    }
}


export function removeBookmarkFailure(error) {
    return {
        type: actionTypes.REMOVE_BOOKMARK_FAILURE,
        errorMessage: error
    }
}