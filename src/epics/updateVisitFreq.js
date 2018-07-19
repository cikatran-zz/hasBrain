import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { updateVisitFreq, getMyInfo } from '../api'
import {
    getLastVisitFailed, getLastVisitSuccess, updateVisitWithInfoSuccess, updateVisitWithInfoFailure,
    updateVisitWithInfo
} from '../actions/updateVisitFreq'

export const getLastVisitEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_LAST_VISIT),
        mergeMap(action =>
            from(getMyInfo()).pipe(
                map(response => {
                    let myInfo = getLastVisitSuccess(response.data, action.dispatcher)
                    let freq = (new Date()) - (new Date(myInfo.visitTime));
                    freq = freq/ (1000 * 60 * 60 * 24);
                    freq = (freq < 1) ? 1 : freq;
                    action.dispatcher(updateVisitWithInfo(myInfo.profileId, new Date(), freq));
                    return myInfo
                }),
                catchError(error => of(getLastVisitFailed(error)))
            )));

export const updateLastVisitEpic = (action$) =>
    action$.pipe(ofType(actionTypes.UPDATING_VISIT_FREQ),
        mergeMap(action =>
            from(updateVisitFreq(action.profileId, action.visitTime, action.freq)).pipe(
                map(response => updateVisitWithInfoSuccess(response.data)),
                catchError(error => of(updateVisitWithInfoFailure(error)))
            )));
