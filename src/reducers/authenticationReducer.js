import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';
import {NativeModules} from 'react-native'

const initialState = {
    signedIn: false,
    onboarded: false,
    isCheckingSignIn: false,
    checkedSignIn: false,
    isCheckingOnboarded: false,
    checkedOnboarded: false,
    isSigningIn: false,
    isSigningUp: false,
    signedUp: false,
    affiliateLoggingIn: false,
    affiliateLoggedIn: false,
    error: null
};

export default function authenticationReducer(state=initialState, action) {
    switch (action.type) {
        case actionTypes.CHECKING_ONBOARDED:
            return {
                ...state,
                isCheckingOnboarded: true
            };
        case actionTypes.CHECK_ONBOARDED_SUCCESS:
            return {
                ...state,
                isCheckingOnboarded: false,
                checkedOnboarded: true,
                onboarded: action.isOnboarded
            };
        case actionTypes.CHECK_ONBOARDED_FAILURE:
            let error = action.errorMessage;
            try {
                error = JSON.parse(action.errorMessage).message;
            } catch (e) {
            }
            return {
                ...state,
                isCheckingOnboarded: false,
                checkedOnboarded: true,
                error: error
            };
        case actionTypes.CHECKING_SIGN_IN:
            return {
                ...state,
                isCheckingSignIn: true
            };
        case actionTypes.CHECK_SIGN_IN_SUCCESS:
            return {
                ...state,
                isCheckingSignIn: false,
                checkedSignIn: true,
                signedIn: action.isSignIn
            };
        case actionTypes.CHECK_SIGN_IN_FAILURE:
            return {
                ...state,
                isCheckingSignIn: false,
                checkedSignIn: true,
                error: action.errorMessage
            };
        case actionTypes.SIGNING_IN_EMAIL:
            return {
                ...state,
                error: null,
                isSigningIn: true,
                isCheckingOnboarded: false,
                checkedOnboarded: false,
            };
        case actionTypes.SIGN_IN_EMAIL_SUCCESS:
            return {
                ...state,
                isSigningIn: false,
                signedIn: true,
            };
        case actionTypes.SIGN_IN_EMAIL_FAILURE:
            return {
                ...state,
                isSigningIn: false,
                signedIn: false,
                error: action.errorMessage
            };
        case actionTypes.SIGNING_UP_EMAIL:
            return {
                ...state,
                error: null,
                isSigningUp: true,
                isCheckingOnboarded: false,
                checkedOnboarded: false,
            };
        case actionTypes.SIGN_UP_EMAIL_SUCCESS:
            return {
                ...state,
                isSigningUp: false,
                signedUp: true,
                signedIn: true
            };
        case actionTypes.SIGN_UP_EMAIL_FAILURE:
            return {
                ...state,
                isSigningUp: false,
                signedUp: true,
                signedIn: false,
                error: action.errorMessage
            };
        case actionTypes.LOGGING_IN_FACEBOOK:
        case actionTypes.LOGGING_IN_GOOGLE:
            return {
                ...state,
                affiliateLoggingIn: true,
                isCheckingOnboarded: false,
                checkedOnboarded: false,
                error: null
            };
        case actionTypes.LOG_IN_FACEBOOK_SUCCESS:
        case actionTypes.LOG_IN_GOOGLE_SUCCESS:
            return {
                ...state,
                affiliateLoggedIn: true,
                affiliateLoggingIn: false,
                signedIn: true,
            };
        case actionTypes.LOG_IN_FACEBOOK_FAILURE:
        case actionTypes.LOG_IN_GOOGLE_FAILURE:
            return {
                ...state,
                affiliateLoggingIn: false,
                affiliateLoggedIn: true,
                error: action.errorMessage
            };
        default:
            return state
    }
}