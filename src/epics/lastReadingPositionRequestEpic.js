import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { getLastReadingPosition } from '../api'
import { getLastReadingPositionFailure, getLastReadingPositionSuccess } from '../actions/getLastReadingPosition'

const getLastReadingPositionEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_LAST_READING_POSITION),
        mergeMap(action =>
            from(getLastReadingPosition()).pipe(
                map(response => getLastReadingPositionSuccess(response)),
                catchError(error => of(getLastReadingPositionFailure(error)))
        )));

export default getLastReadingPositionEpic