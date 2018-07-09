import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { getLastReadingHistory } from '../api'
import {getContinueReadingSuccess, getContinueReadingFailure} from '../actions/getContinueReading'

const getContinueReadingEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_CONTINUE_READING),
        mergeMap(action =>
            from(getLastReadingHistory(action.maximum)).pipe(
                map(response => getContinueReadingSuccess(response)),
                catchError(error => of(getContinueReadingFailure(error)))
            )));

export default getContinueReadingEpic