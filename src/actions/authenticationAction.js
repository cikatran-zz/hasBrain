import * as actionTypes from './actionTypes';
import _ from 'lodash';


// CHECK SIGN IN
export function checkSignIn() {
    return {
        type: actionTypes.CHECKING_SIGN_IN,
    }
}

export function checkSignInSuccess(isSignIn) {
    return {
        type: actionTypes.CHECK_SIGN_IN_SUCCESS,
        isSignIn: isSignIn
    }
}


export function checkSignInFailure(error) {
    return {
        type: actionTypes.CHECK_SIGN_IN_FAILURE,
        errorMessage: error
    }
}

// CHECK ONBOARDED
export function checkOnboarded() {
    return {
        type: actionTypes.CHECKING_ONBOARDED,
    }
}

export function checkOnboardedSuccess(isOnboarded) {
    return {
        type: actionTypes.CHECK_ONBOARDED_SUCCESS,
        isOnboarded: isOnboarded
    }
}


export function checkOnboardedFailure(error) {
    return {
        type: actionTypes.CHECK_ONBOARDED_FAILURE,
        errorMessage: error
    }
}


// SIGN UP WITH EMAIL
export function signUpEmail(email, password, properties) {
    return {
        type: actionTypes.SIGNING_UP_EMAIL,
        email: email,
        password: password,
        properties: properties
    }
}

export function signUpEmailSuccess() {
    return {
        type: actionTypes.SIGN_UP_EMAIL_SUCCESS
    }
}

export function signUpEmailFailure(err) {
    return {
        type: actionTypes.SIGN_UP_EMAIL_FAILURE,
        errorMessage: error
    }
}

// SIGN IN EMAIL
export function signInEmail(email, password) {
    return {
        type: actionTypes.SIGNING_IN_EMAIL,
        email: email,
        password: password
    }
}

export function signInEmailSuccess() {
    return {
        type: actionTypes.SIGN_IN_EMAIL_SUCCESS
    }
}

export function signInEmailFailure(error) {
    return {
        type: actionTypes.SIGN_IN_EMAIL_FAILURE,
        errorMessage: error
    }
}

// LOG IN GOOGLE
export function logInGoogle(token) {
    return {
        type: actionTypes.LOGGING_IN_GOOGLE,
        token: token,
    }
}

export function logInGoogleSuccess(response) {
    return {
        type: actionTypes.LOG_IN_GOOGLE_SUCCESS,
        newAccount: _.get(response,"is_sign_in")
    }
}

export function logInGoogleFailure(error) {
    return {
        type: actionTypes.LOG_IN_GOOGLE_FAILURE,
        errorMessage: "Login failure"
    }
}

// LOG IN FACEBOOK
export function logInFacebook(token) {
    return {
        type: actionTypes.LOGGING_IN_FACEBOOK,
        token: token,
    }
}

export function logInFacebookSuccess(response) {
    return {
        type: actionTypes.LOG_IN_FACEBOOK_SUCCESS,
        newAccount: _.get(response,"is_sign_in")
    }
}

export function logInFacebookFailure(error) {
    return {
        type: actionTypes.LOG_IN_FACEBOOK_FAILURE,
        errorMessage: error.message
    }
}