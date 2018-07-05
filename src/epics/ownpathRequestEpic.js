import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { getOwnpath } from '../api'
import { getOwnpathFailure, getOwnpathSuccess } from '../actions/getOwnpath'

const getOwnpathEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_OWNPATH),
        mergeMap(action =>
            from(getOwnpath()).pipe(
                map(response => getOwnpathSuccess(response.data)),
                catchError(error => of(getOwnpathFailure(error)))
            )));

export default getOwnpathEpic
