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
    if (trackingType === strings.articleType) {
        let props = {
            [strings.contentConsumed.contentId]: contentId,
            [strings.contentConsumed.mediaType]: trackingType
        };
        RNUserKit.trackEvent(strings.contentBookmarked.event, props);
    }

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