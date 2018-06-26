import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { getIntents } from '../api'
import { getIntentsSuccess, getIntentsFailure } from '../actions/getIntention'

const getIntentsEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_INTENT),
        mergeMap(action =>
            from(getIntents(action.segments)).pipe(
                map(response => {
                    return getIntentsSuccess(response.data)
                }),
                catchError(error => of(getIntentsFailure(error)))
            )));

export default getIntentsEpic