import * as actionTypes from '../actions/actionTypes';
import {removeBookmarkFailure, removeBookmarkSuccess} from '../actions/removeBookmark';
import {postRemoveBookmark} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import {trackUnbookmark} from "../actions/userkitTracking";

const removeBookmarkEpic = (action$) =>
    action$.pipe(ofType(actionTypes.REMOVING_BOOKMARK),
        mergeMap(action =>
            from(postRemoveBookmark(action.contentId, action.contentType)).pipe(
                map(response => {
                    action.dispatcher(trackUnbookmark(action.contentId, action.trackingType));
                    return removeBookmarkSuccess(action.contentId)
                }),
                catchError(error => of(removeBookmarkFailure(error)))
            )));

export default removeBookmarkEpic;