import * as actionTypes from '../actions/actionTypes';
import {getPathBookmarkedFailure, getPathBookmarkedSuccess} from '../actions/getPathBookmarked';
import {getSaved} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';

const getPathBookmarkedEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_PATH_BOOKMARKED),
        mergeMap(action =>
            from(getSaved(action.page, action.perPage, "pathtype")).pipe(
                map(response => getPathBookmarkedSuccess(response.data, action.page)),
                catchError(error => of(getPathBookmarkedFailure(error)))
        )));

export default getPathBookmarkedEpic;