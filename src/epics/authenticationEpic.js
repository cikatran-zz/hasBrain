import * as actionTypes from '../actions/actionTypes';
import {
    checkOnboardedSuccess,
    checkSignInFailure,
    checkOnboardedFailure,
    checkSignInSuccess,
    signInEmailSuccess,
    signInEmailFailure,
    signUpEmailSuccess,
    signUpEmailFailure,
    logInFacebookSuccess,
    logInFacebookFailure,
    logInGoogleFailure,
    logInGoogleSuccess
} from '../actions/authenticationAction';
import {checkSignIn, checkExperienceField, signInWithEmail, signUpWithEmail, logInWithFacebook, logInWithGoogle} from '../api';
import {from, of} from 'rxjs';
import {ofType} from 'redux-observable';
import {mergeMap, catchError, map} from 'rxjs/operators';

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

export const signInEmailEpic = (action$) =>
    action$.pipe(ofType(actionTypes.SIGNING_IN_EMAIL),
        mergeMap(action =>
            from(signInWithEmail(action.email, action.password)).pipe(
                map(response => signInEmailSuccess()),
                catchError(error => of(signInEmailFailure(error)))
            )
        ));

export const signUpEmailEpic = (action$) =>
    action$.pipe(ofType(actionTypes.SIGNING_UP_EMAIL),
        mergeMap(action =>
            from(signUpWithEmail(action.email, action.password, action.properties)).pipe(
                map(response => signUpEmailSuccess()),
                catchError(error => of(signUpEmailFailure(error)))
            )
        ));

export const logInGoogleEpic = (action$) =>
    action$.pipe(ofType(actionTypes.LOGGING_IN_GOOGLE),
        mergeMap(action =>
            from(logInWithGoogle()).pipe(
                map(response => logInGoogleSuccess()),
                catchError(error => of(logInGoogleFailure(error)))
            )
        ));

export const logInFacebookEpic = (action$) =>
    action$.pipe(ofType(actionTypes.LOGGING_IN_FACEBOOK),
        mergeMap(action =>
            from(logInWithFacebook()).pipe(
                map(response => logInFacebookSuccess()),
                catchError(error => of(logInFacebookFailure(error)))
            )
        ));
