import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { getSourceList } from '../api'
import { getSourceListSuccess, getSourceListFailure } from '../actions/getSourceList'

const getSourceListEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_SOURCE_LIST),
        mergeMap(action =>
            from(getSourceList()).pipe(
                map(response => {
                    return getSourceListSuccess(response)
                }),
                catchError(error => of(getSourceListFailure(error)))
            )));

export default getSourceListEpic
