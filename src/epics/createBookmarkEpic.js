import * as actionTypes from '../actions/actionTypes';
import {createBookmarkFailure, createBookmarkSuccess} from '../actions/createBookmark';
import {postCreateBookmark} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {getSaved} from "../actions/getSaved";

const createBookmarkEpic = (action$) =>
    action$.ofType(actionTypes.CREATING_BOOKMARK)
        .mergeMap(action =>
            Observable.from(postCreateBookmark(action.contentId, action.contentType))
                .map(response => createBookmarkSuccess(action.contentId, action.trackingType))
                .catch(error => Observable.of(createBookmarkFailure(error)))
        );

export default createBookmarkEpic;