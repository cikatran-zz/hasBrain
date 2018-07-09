import * as actionTypes from './actionTypes';
import {strings} from "../constants/strings";
import {NativeModules} from "react-native";
const {RNUserKit} = NativeModules;

export function createHighlight(articleId, highlightedText, position, comment, note) {
    console.log("Create:",articleId, highlightedText, position, comment, note);
    return {
        type: actionTypes.CREATING_USER_HIGHLIGHT,
        articleId: articleId,
        highlight: highlightedText,
        position: position,
        comment: comment,
        note: note
    }
}

export function createHighlightSuccess(articleId, highlightedText, position, comment, note) {
    console.log(articleId, highlightedText, position, comment, note);
    let props = {
        [strings.contentEvent.contentId]: articleId,
        [strings.contentEvent.mediaType]: strings.trackingType.article,
        [strings.contentHighlighted.highlight]: highlightedText,
        [strings.contentHighlighted.position]: position,
        [strings.contentHighlighted.comment]: comment,
        [strings.contentHighlighted.note]: note
    };
    RNUserKit.track(strings.contentHighlighted.event, props);
    return {
        type: actionTypes.FETCHING_USER_HIGHLIGHT,
        page: 1,
        perPage: 10
    }
}


export function createHighlightFailure(error) {
    return {
        type: actionTypes.CREATE_USER_HIGHLIGHT_FAILURE,
        errorMessage: error
    }
}