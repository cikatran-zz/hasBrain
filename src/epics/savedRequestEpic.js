import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getSaved } from '../api'
import { getSavedFailure, getSavedSuccess } from '../actions/getSaved'

const getSavedEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_SAVED)
        .mergeMap(action =>
            Observable.from(getSaved())
                .map(response => {
                    return getSavedSuccess(response)
                })
                .catch(error => Observable.of(getSavedFailure(error)))
        )

export default getSavedEpic
