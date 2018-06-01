import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getLastReadingPosition } from '../api'
import { getLastReadingPositionFailure, getLastReadingPositionSuccess } from '../actions/getLastReadingPosition'

const getLastReadingPositionEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_LAST_READING_POSITION)
        .mergeMap(action =>
            Observable.from(getLastReadingPosition())
                .map(response => getLastReadingPositionSuccess(response))
                .catch(error => Observable.of(getLastReadingPositionFailure(error)))
        )

export default getLastReadingPositionEpic