import * as actionTypes from './actionTypes'

export function getOnboarding() {
    return {
        type: actionTypes.FETCHING_ONBOARDING
    }
}

export function getOnboardingSuccess(data) {
    return {
        type: actionTypes.FETCH_ONBOARDING_SUCCESS,
        data: data.data.viewer
    }
}

export function getOnboardingFailure(error) {
    return {
        type: actionTypes.FETCH_ONBOARDING_FAILURE,
        errorMessage: error
    }
}
