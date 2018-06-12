import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getIntents } from '../api'
import { getAllIntentsSuccess, getAllIntentsFailure } from '../actions/getAllIntention'

const getAllIntentsEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_ALL_INTENT)
        .mergeMap(action =>
            Observable.from(getIntents([]))
                .map(response => getAllIntentsSuccess(response.data))
                .catch(error => Observable.of(getAllIntentsFailure(error)))
        )

export default getAllIntentsEpic