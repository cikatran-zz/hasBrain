import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    updated: false,
    isUpdating: false,
    error: false,
};

export default function updateUserTopicSourceReducer(state = initialState, action) {

    switch (action.type) {
        case actionTypes.UPDATING_USER_TOPIC:
            return {
                ...state,
                isUpdating: true
            };
        case actionTypes.UPDATE_USER_TOPIC_SUCCESS:
            return {
                ...state,
                isUpdating: false,
                updated: true,
                data: action.data
            };
        case actionTypes.UPDATE_USER_TOPIC_FAILURE:
            return {
                ...state,
                isUpdating: false,
                updated: true,
                error: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
};