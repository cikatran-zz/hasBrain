import * as actionTypes from './actionTypes';
import {strings} from "../constants/strings";
import {NativeModules} from "react-native";
import {trackBookmark} from "./userkitTracking";
const {RNUserKit} = NativeModules;

export function createBookmark(contentId, bookmarkType, trackingType, dispatch) {
    return {
        type: actionTypes.CREATING_BOOKMARK,
        contentId: contentId,
        contentType: bookmarkType,
        trackingType: trackingType,
        dispatcher: dispatch
    }
}

export function createBookmarkSuccess(contentId) {
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