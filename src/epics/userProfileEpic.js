import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { getUserProfile, getUserAnalyst, updateUserProfile, getUserName, getAvatar } from '../api'
import {
    getUserAnalystSuccess,
    getUserProfileSuccess,
    updateUserProfileSuccess,
    getUserAnalystFailure,
    getUserProfileFailure,
    updateUserProfileFailure,
    getUserNameSuccess,
    getUserNameFailure,
    getAvatarSuccess,
    getAvatarFailure
} from '../actions/userProfileAction'

export const getUserProfileEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_USER_PROFILE),
        mergeMap(action =>
            from(getUserProfile()).pipe(
                map(response => {
                    return getUserProfileSuccess(response)
                }),
                catchError(error => of(getUserProfileFailure(error)))
            )));

export const getUserNameEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_USER_PROFILE),
        mergeMap(action =>
            from(getUserName()).pipe(
                map(response => {
                    return getUserNameSuccess(response)
                }),
                catchError(error => of(getUserNameFailure(error)))
            )));

export const getAvatarEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_AVATAR),
        mergeMap(action =>
            from(getAvatar()).pipe(
                map(response => {
                    return getAvatarSuccess(response)
                }),
                catchError(error => of(getAvatarFailure(error)))
            )));

export const updateUserProfileEpic = (action$) =>
    action$.pipe(ofType(actionTypes.UPDATING_USER_PROFILE),
        mergeMap(action =>
            from(updateUserProfile(action.role, action.summary)).pipe(
                map(response => {
                    return updateUserProfileSuccess()
                }),
                catchError(error => of(updateUserProfileFailure(error)))
            )));

export const getUserAnalystEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_USER_ANALYST),
        mergeMap(action =>
            from(getUserAnalyst()).pipe(
                map(response => {
                    return getUserAnalystSuccess(response)
                }),
                catchError(error => of(getUserAnalystFailure(error)))
            )));
