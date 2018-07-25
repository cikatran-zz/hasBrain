import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';
import {NativeModules} from 'react-native'

const initialState = {
    signIn: false,
    onboarded: false,
    isCheckingSignIn: false,
    checkedSignIn: false,
    isCheckingOnboarded: false,
    checkedOnboarded: false,
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
            return {
                ...state,
                isCheckingOnboarded: false,
                checkedOnboarded: true,
                error: action.errorMessage
            }
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
                signIn: action.isSignIn
            };
        case actionTypes.CHECK_SIGN_IN_FAILURE:
            return {
                ...state,
                isCheckingSignIn: false,
                checkedSignIn: true,
                error: action.errorMessage
            };
        default:
            return state
    }
}