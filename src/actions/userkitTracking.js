import * as actionTypes from './actionTypes';
import {strings} from "../constants/strings";
import {NativeModules} from 'react-native'
const {RNUserKit} = NativeModules;
import _ from 'lodash';

const initAction = {
    type: actionTypes.TRACK_USERKIT_EVENT
};

export function trackSharing(contentId, type){
    let props = {
        [strings.contentEvent.contentId]: contentId,
        [strings.contentEvent.mediaType]: type
    };
    RNUserKit.track(strings.contentShared.event, props);
    return {
        ...initAction,
        name: "share"
    };
}

export function trackDislike(contentId, type){
    let props = {
        [strings.contentEvent.contentId]: contentId,
        [strings.contentEvent.mediaType]: type
    };
    RNUserKit.track(strings.contentDislike.event, props);
    return {
        ...initAction,
        name: "dislike"
    };
}

export function trackUnbookmark(contentId, type) {
    let props = {
        [strings.contentEvent.contentId]: contentId,
        [strings.contentEvent.mediaType]: type
    };
    RNUserKit.track(strings.contentUnbookmarked.event, props);
    return {
        ...initAction,
        name: "unbookmark"
    };
}

export function trackBookmark(contentId, type){
    let props = {
        [strings.contentEvent.contentId]: contentId,
        [strings.contentEvent.mediaType]: type
    };
    RNUserKit.track(strings.contentBookmarked.event, props);
    return {
        ...initAction,
        name: "bookmark"
    };
}

export function trackHighlight(data) {
    let props = {
        [strings.contentEvent.contentId]: _.get(data, 'id', ''),
        [strings.contentEvent.mediaType]: strings.trackingType.article,
        [strings.contentHighlighted.highlight]: _.get(data, 'core', ''),
    };
    RNUserKit.track(strings.contentHighlighted.event, props);

    return {
        ...initAction,
        name: "highlight"
    };
}

export function trackConsume(readingTimeInSec, articleId, type) {
    let props = {
        [strings.contentConsumed.consumedLength]: readingTimeInSec,
        [strings.contentEvent.contentId]: articleId,
        [strings.contentEvent.mediaType]: type
    };
    RNUserKit.track(strings.contentConsumed.event, props);
    return {
        ...initAction,
        name: "comsume"
    };
}

export function trackCategory(category, time) {
    if (category != null) {
        let increment = {[strings.readingTagsKey + "." + category]: time};
        RNUserKit.incrementProperty(increment, (err, res) => {
        });
    }
    return {
        ...initAction,
        name: "category_comsume"
    }
}