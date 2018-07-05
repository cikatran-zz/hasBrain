import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { getCategory } from '../api'
import { getCategorySuccess, getCategoryFailure } from '../actions/getCategory'

const getCategoryEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_CATEGORY),
        mergeMap(action =>
            from(getCategory()).pipe(
                map(response => getCategorySuccess(response.data)),
                catchError(error => of(getCategoryFailure(error)))
            )));

export default getCategoryEpic