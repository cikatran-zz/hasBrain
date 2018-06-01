import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getUserProfile, getUserAnalyst, updateUserProfile } from '../api'
import {
    getUserAnalystSuccess,
    getUserProfileSuccess,
    updateUserProfileSuccess,
    getUserAnalystFailure,
    getUserProfileFailure,
    updateUserProfileFailure
} from '../actions/userProfileAction'

export const getUserProfileEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_USER_PROFILE)
        .mergeMap(action =>
            Observable.from(getUserProfile())
                .map(response => {
                    return getUserProfileSuccess(response.data)
                })
                .catch(error => Observable.of(getUserProfileFailure(error)))
        );

export const updateUserProfileEpic = (action$) =>
    action$.ofType(actionTypes.UPDATING_USER_PROFILE)
        .mergeMap(action =>
            Observable.from(updateUserProfile(action.role, action.summary))
                .map(response => {
                    return updateUserProfileSuccess()
                })
                .catch(error => Observable.of(updateUserProfileFailure(error)))
        );

export const getUserAnalystEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_USER_ANALYST)
        .mergeMap(action =>
            Observable.from(getUserAnalyst())
                .map(response => {
                    return getUserAnalystSuccess(response.data)
                })
                .catch(error => Observable.of(getUserAnalystFailure(error)))
        );
