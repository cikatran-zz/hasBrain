import * as actionTypes from '../actions/actionTypes';
import {getPathBookmarkedFailure, getPathBookmarkedSuccess} from '../actions/getPathBookmarked';
import {getSaved} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getPathBookmarkedEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_PATH_BOOKMARKED)
        .mergeMap(action =>
            Observable.from(getSaved(action.page, action.perPage, "pathtype"))
                .map(response => getPathBookmarkedSuccess(response.data, action.page))
                .catch(error => Observable.of(getPathBookmarkedFailure(error)))
        );

export default getPathBookmarkedEpic;