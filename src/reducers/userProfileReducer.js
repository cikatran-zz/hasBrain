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
    updateUserProfileError: null,
    userName: null,
    userNameFetching: false,
    userNameFetched: false,
    fetchUserNameError: null
}

export default function userProfileReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_USER_PROFILE:
            return {
                ...state,
                userProfileFetching: true
            }
        case actionTypes.FETCHING_USER_NAME:
            return {
                ...state,
                userNameFetching: true
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
        case actionTypes.FETCH_USER_NAME_SUCCESS:
            return {
                ...state,
                userNameFetching: false,
                userNameFetched: true,
                userName: action.data,
            }
        case actionTypes.FETCH_USER_ANALYST_SUCCESS:
            let userAnalystData = [];
            if (action.data) {
                userAnalystData = _.map(action.data, (o, m) => {
                    return {object: m, time: o};
                })
            }
            userAnalystData = _.orderBy(userAnalystData, ['time'], ['desc']);
            let tempAnalystData = [];
            let totalTime = _.sumBy(userAnalystData, 'time');
            for (let i = 0; i < 6; i++) {
                let analystData = userAnalystData[i];
                if (analystData) {
                    let percentage = (analystData.time / totalTime) * 100;
                    let newData = {name: analystData.object, percentage: percentage}
                    tempAnalystData = _.concat(tempAnalystData, newData);
                } else {
                    tempAnalystData = _.concat(tempAnalystData, {name: "None", percentage: 0});
                }
            }
            return {
                ...state,
                userAnalystFetching: false,
                userAnalystFetched: true,
                userAnalystData: tempAnalystData
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
        case actionTypes.FETCH_USER_NAME_FAILURE:
            return {
                ...state,
                userNameFetching: false,
                userNameFetched: true,
                fetchUserNameError: action.errorMessage
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
