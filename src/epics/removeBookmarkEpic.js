import * as actionTypes from '../actions/actionTypes';
import {removeBookmarkFailure, removeBookmarkSuccess} from '../actions/removeBookmark';
import {postRemoveBookmark} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const removeBookmarkEpic = (action$) =>
    action$.ofType(actionTypes.REMOVING_BOOKMARK)
        .mergeMap(action =>
            Observable.from(postRemoveBookmark(action.contentId, action.contentType))
                .map(response => removeBookmarkSuccess(action.contentId, action.trackingType))
                .catch(error => Observable.of(removeBookmarkFailure(error)))
        );

export default removeBookmarkEpic;