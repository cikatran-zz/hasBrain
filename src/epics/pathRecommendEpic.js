import * as actionTypes from '../actions/actionTypes';
import {getPathRecommendFailure, getPathRecommendSuccess} from '../actions/getPathRecommend';
import {getPathRecommend} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';

const getPathRecommendEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_PATH_RECOMMEND),
        mergeMap(action =>
            from(getPathRecommend(action.page, action.perPage)).pipe(
                map(response => getPathRecommendSuccess(response.data, action.page)),
                catchError(error => of(getPathRecommendFailure(error)))
        )));

export default getPathRecommendEpic;