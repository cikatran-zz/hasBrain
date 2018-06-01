import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getUserHighLight } from '../api'
import { getUserHighLightFailure, getUserHighLightSuccess } from '../actions/getUserHighLight'

const getUserHighLightEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_USER_HIGHLIGHT)
        .mergeMap(action =>
            Observable.from(getUserHighLight(action.page, action.perPage))
                .map(response => {
                    return getUserHighLightSuccess(response.data, action.page)
                })
                .catch(error => Observable.of(getUserHighLightFailure(error)))
        )

export default getUserHighLightEpic
