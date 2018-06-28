import * as actionTypes from '../actions/actionTypes'
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { getBookmarkedIds } from '../api'
import { getBookmarkedIdsFailure, getBookmarkedIdsSuccess } from '../actions/getBookmarkedIds'
import {strings} from "../constants/strings";

const getBookmarkedIdsEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_BOOKMARKEDIDS),
        mergeMap(action =>
            from(getBookmarkedIds(1, 1000)).pipe(
                map(response => getBookmarkedIdsSuccess(response.data)),
                catchError(error => of(getBookmarkedIdsFailure(error)))
        )));

export default getBookmarkedIdsEpic
