import * as actionTypes from './actionTypes';
import {strings} from "../constants/strings";
import {NativeModules} from "react-native";
const {RNUserKit} = NativeModules;

export function createBookmark(contentId, bookmarkType, trackingType) {
    return {
        type: actionTypes.CREATING_BOOKMARK,
        contentId: contentId,
        contentType: bookmarkType,
        trackingType: trackingType
    }
}

export function createBookmarkSuccess(contentId, trackingType) {
    let props = {
        [strings.contentEvent.contentId]: contentId,
        [strings.contentEvent.mediaType]: trackingType
    };
    RNUserKit.track(strings.contentBookmarked.event, props);
    // return {
    //     type: actionTypes.FETCHING_BOOKMARKEDIDS,
    // };
    return {
        type: actionTypes.CREATE_BOOKMARK_SUCCESS,
        contentId: contentId
    }
}


export function createBookmarkFailure(error) {
    return {
        type: actionTypes.CREATE_BOOKMARK_FAILURE,
        errorMessage: error
    }
}