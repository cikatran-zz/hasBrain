import * as actionTypes from './actionTypes';
import {strings} from "../constants/strings";
import {NativeModules} from "react-native";
const {RNUserKit} = NativeModules;

export function removeBookmark(contentId, bookmarkType, trackingType) {
    return {
        type: actionTypes.REMOVING_BOOKMARK,
        contentId: contentId,
        contentType: bookmarkType,
        trackingType: trackingType
    }
}

export function removeBookmarkSuccess(contentId, trackingType) {
    let props = {
        [strings.contentEvent.contentId]: contentId,
        [strings.contentEvent.mediaType]: trackingType
    };
    RNUserKit.track(strings.contentUnbookmarked.event, props);

    return {
        type: actionTypes.FETCHING_BOOKMARKEDIDS
    }

    // return {
    //     type: actionTypes.REMOVE_BOOKMARK_SUCCESS,
    //     contentId: contentId
    // }
}


export function removeBookmarkFailure(error) {
    return {
        type: actionTypes.REMOVE_BOOKMARK_FAILURE,
        errorMessage: error
    }
}