import * as actionTypes from '../actions/actionTypes';
import {getFeedFailure, getFeedSuccess} from '../actions/getFeed';
import {getFeed} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';

const getFeedEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_FEED),
        mergeMap(action =>
            from(getFeed(action.page, action.perPage, action.rank, action.topics)).pipe(
                map(response => getFeedSuccess(response.data, action.page, action.rank)),
                catchError(error => of(getFeedFailure(error)))
        )));

export default getFeedEpic;