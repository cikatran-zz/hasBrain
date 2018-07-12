import * as actionTypes from '../actions/actionTypes';
import {createBookmarkFailure, createBookmarkSuccess} from '../actions/createBookmark';
import {postCreateBookmark} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import {trackBookmark} from "../actions/userkitTracking";

const createBookmarkEpic = (action$) =>
    action$.pipe(ofType(actionTypes.CREATING_BOOKMARK),
        mergeMap(action =>
            from(postCreateBookmark(action.contentId, action.contentType)).pipe(
                map(response => {
                        action.dispatcher(trackBookmark(action.contentId, action.trackingType));
                        return createBookmarkSuccess(action.contentId)
                }),
                catchError(error => of(createBookmarkFailure(error)))
        )));

export default createBookmarkEpic;