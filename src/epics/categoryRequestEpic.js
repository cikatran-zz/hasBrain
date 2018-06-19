import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getCategory } from '../api'
import { getCategorySuccess, getCategoryFailure } from '../actions/getCategory'

const getCategoryEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_CATEGORY)
        .mergeMap(action =>
            Observable.from(getCategory())
                .map(response => getCategorySuccess(response.data))
                .catch(error => Observable.of(getCategoryFailure(error)))
        )

export default getCategoryEpic