import * as actionTypes from '../actions/actionTypes'
import _ from 'lodash'

const initialState = {
    userProfileData: null,
    userAnalystData: null,
    userProfileFetched: false,
    userProfileFetching: false,
    userAnalystFetching: false,
    userAnalystFetched: false,
    updated: false,
    updating: false,
    updateError: null,
    fetchUserProfileError: null,
    fetchUserAnalystError: null,
    updateUserProfileError: null
}

export default function userProfileReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_USER_PROFILE:
            return {
                ...state,
                userProfileFetching: true
            }
        case actionTypes.FETCHING_USER_ANALYST:
            return {
                ...state,
                userAnalystFetching: true
            }
        case actionTypes.UPDATING_USER_PROFILE:
            return {
                ...state,
                updating: true
            }
        case actionTypes.FETCH_USER_PROFILE_SUCCESS:
            return {
                ...state,
                userProfileFetching: false,
                userProfileFetched: true,
                userProfileData: action.data,
            }
        case actionTypes.FETCH_USER_ANALYST_SUCCESS:
            return {
                ...state,
                userAnalystFetching: false,
                userAnalystFetched: true,
                userAnalystData: action.data
            }
        case actionTypes.UPDATE_USER_PROFILE_SUCCESS:
            return {
                ...state,
                updating: false,
                updated: true,
            }
        case actionTypes.FETCH_USER_PROFILE_FAILURE:
            return {
                ...state,
                userProfileFetching: false,
                userProfileFetched: true,
                fetchUserProfileError: action.errorMessage
            }

        case actionTypes.FETCH_USER_ANALYST_FAILURE:
            return {
                ...state,
                userAnalystFetching: false,
                userAnalystFetched: true,
                fetchUserAnalystError: action.errorMessage
            }
        case actionTypes.UPDATE_USER_PROFILE_FAILURE:
            return {
                ...state,
                updating: false,
                updated: true,
                updateError: action.errorMessage
            }
        default:
            return state
    }
}
