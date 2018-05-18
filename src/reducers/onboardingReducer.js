import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false
}

export default function onboardingReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_ONBOARDING:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_ONBOARDING_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            }
        case actionTypes.FETCH_ONBOARDING_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            }
        default:
            return state
    }
}
