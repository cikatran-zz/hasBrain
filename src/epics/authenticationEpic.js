import * as actionTypes from '../actions/actionTypes';
import {checkOnboardedSuccess, checkSignInFailure, checkOnboardedFailure, checkSignInSuccess, checkOnboarded} from '../actions/authenticationAction';
import {checkSignIn, checkExperienceField} from '../api';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, catchError, map} from 'rxjs/operators';

export const checkSignInEpic = (action$) =>
    action$.pipe(ofType(actionTypes.CHECKING_SIGN_IN),
        mergeMap(action =>
            from(checkSignIn()).pipe(
                map(response => checkSignInSuccess(response)),
                catchError(error => of(checkSignInFailure(error)))
            )
        ));

export const checkOnboardedEpic = (action$) =>
    action$.pipe(ofType(actionTypes.CHECKING_ONBOARDED),
        mergeMap(action =>
            from(checkExperienceField()).pipe(
                map(response => checkOnboardedSuccess(response)),
                catchError(error => of(checkOnboardedFailure(error)))
            )
        ));