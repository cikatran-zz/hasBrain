import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { getUserHighLight } from '../api'
import { getUserHighLightFailure, getUserHighLightSuccess } from '../actions/getUserHighLight'

const getUserHighLightEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_USER_HIGHLIGHT),
        mergeMap(action =>
            from(getUserHighLight(action.page, action.perPage)).pipe(
                map(response => {
                    return getUserHighLightSuccess(response.data, action.page)
                }),
                catchError(error => of(getUserHighLightFailure(error)))
            )));

export default getUserHighLightEpic
