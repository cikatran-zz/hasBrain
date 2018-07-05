import * as actionTypes from '../actions/actionTypes'
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { getIntents } from '../api'
import { getAllIntentsSuccess, getAllIntentsFailure } from '../actions/getAllIntention'

const getAllIntentsEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_ALL_INTENT),
        mergeMap(action =>
            from(getIntents([])).pipe(
                map(response => getAllIntentsSuccess(response.data)),
                catchError(error => of(getAllIntentsFailure(error)))
            )
        ));

export default getAllIntentsEpic