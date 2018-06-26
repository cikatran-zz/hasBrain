import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { getUserPath } from '../api'
import { getUserPathSuccess, getUserPathFailure } from '../actions/getUserPath'

const getUserPathEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_USER_PATH),
        mergeMap(action =>
            from(getUserPath(action.pathId)).pipe(
                map(response => {
                    return getUserPathSuccess(response.data)
                }),
                catchError(error => of(getUserPathFailure(error)))
            )));

export default getUserPathEpic
