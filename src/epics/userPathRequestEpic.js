import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getUserPath } from '../api'
import { getUserPathSuccess, getUserPathFailure } from '../actions/getUserPath'

const getUserPathEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_USER_PATH)
        .mergeMap(action =>
            Observable.from(getUserPath(action.pathId))
                .map(response => {
                    return getUserPathSuccess(response.data)
                })
                .catch(error => Observable.of(getUserPathFailure(error)))
        );

export default getUserPathEpic
