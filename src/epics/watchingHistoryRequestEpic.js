import * as actionTypes from '../actions/actionTypes';
import {getWatchingHistoryFailure, getWatchingHistorySuccess} from '../actions/getWatchingHistory';
import {getWatchingHistory} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getWatchingHistoryEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_WATCHING_HISTORY)
        .mergeMap(action =>
            Observable.from(getWatchingHistory(action.contentId))
                .map(response => getWatchingHistorySuccess(response))
                .catch(error => Observable.of(getWatchingHistoryFailure(error)))
        );

export default getWatchingHistoryEpic;