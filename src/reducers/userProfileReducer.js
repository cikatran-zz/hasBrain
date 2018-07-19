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
    fetchUserNameError: null,
    avatar: null,
    avatarFetching: false,
    avatarFetched: false,
    fetchAvatarError: null
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
        case actionTypes.FETCHING_AVATAR:
            return {
                ...state,
                avatarFetching: true
            }
        case actionTypes.FETCHING_USER_ANALYST:
            return {
                ...state,
                userAnalystFetching: true
            }
        case actionTypes.UPDATING_USER_PROFILE:
            let newUserProfileData = {
                ...state.userProfileData,
                role: action.role,
                about: action.summary
            }
            return {
                ...state,
                updating: true,
                userProfileData: newUserProfileData
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
        case actionTypes.FETCH_AVATAR_SUCCESS:
            let value = action.data;
            let avatar = value[0].avatar;
            let _avatar = value[1]._avatar;
            let image = null;
            if (_.isEmpty(avatar)) {
                // Use _avatar
                if (typeof _avatar === "string") {
                    image = _avatar
                } else {
                    image = _.get(_avatar,'[0].url');
                }
            } else {
                // Use avatar
                if (typeof avatar === "string") {
                    image = avatar;
                } else {
                    image = _.get(avatar,'[0].url');
                }
            }
            return {
                ...state,
                avatarFetching: false,
                avatarFetched: true,
                avatar: image
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
                    let newData = {name: analystData.object, percentage: percentage ? percentage : 0}
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
        case actionTypes.FETCH_AVATAR_FAILURE:
            return {
                ...state,
                avatarFetching: false,
                avatarFetched: true,
                fetchAvatarError: action.errorMessage
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
