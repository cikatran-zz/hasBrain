import * as actionTypes from '../actions/actionTypes';
import {getPathCurrentSuccess, getPathCurrentFailure} from '../actions/getPathCurrent';
import {getCurrentPath} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';

const getPathCurrentEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_PATH_CURRENT),
        mergeMap(action =>
            from(getCurrentPath()).pipe(
                map(response => getPathCurrentSuccess(response.data)),
                catchError(error => of(getPathCurrentFailure(error)))
            )));

export default getPathCurrentEpic;