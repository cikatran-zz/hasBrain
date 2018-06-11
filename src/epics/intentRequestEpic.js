import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getIntents } from '../api'
import { getIntentsSuccess, getIntentsFailure } from '../actions/getIntention'

const getIntentsEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_INTENT)
        .mergeMap(action =>
            Observable.from(getIntents(action.segments))
                .map(response => {
                    return getIntentsSuccess(response.data)
                })
                .catch(error => Observable.of(getIntentsFailure(error)))
        )

export default getIntentsEpic