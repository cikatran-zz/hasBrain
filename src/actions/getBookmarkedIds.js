import * as actionTypes from './actionTypes'
import {strings} from "../constants/strings";

export function getBookmarkedIds() {
    return {
        type: actionTypes.FETCHING_BOOKMARKEDIDS
    }
}

export function getBookmarkedIdsSuccess(data) {
    let paths = [];
    let articles = [];
    let items = data.viewer.userbookmarkPagination.items;
    if (items) {
        items = items.map(x=>x.content);
        articles = (items.filter(x=>x.kind === strings.bookmarkType.article)).map((x)=>x._id);
        paths = (items.filter(x=>x.kind === strings.bookmarkType.path)).map((x)=>x._id);
    }
    return {
        type: actionTypes.FETCH_BOOKMARKEDIDS_SUCCESS,
        data: {paths: paths, articles: articles},
    }
}

export function getBookmarkedIdsFailure(error) {
    return {
        type: actionTypes.FETCH_BOOKMARKEDIDS_FAILURE,
        errorMessage: error
    }
}
