import * as actionTypes from '../actions/actionTypes';
import {getWatchingHistoryFailure, getWatchingHistorySuccess} from '../actions/getWatchingHistory';
import {getWatchingHistory} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';

const getWatchingHistoryEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_WATCHING_HISTORY),
        mergeMap(action =>
            from(getWatchingHistory(action.contentId)).pipe(
                map(response => getWatchingHistorySuccess(response)),
                catchError(error => of(getWatchingHistoryFailure(error)))
            )));

export default getWatchingHistoryEpic;