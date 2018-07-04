import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    updated: false,
    isUpdating: false,
    error: false,
};

export default function updateUserContributorFollowReducer(state = initialState, action) {

    switch (action.type) {
        case actionTypes.UPDATE_USER_CONTRIBUTOR_FOLLOW:
            return {
                ...state,
                isUpdating: true
            };
        case actionTypes.UPDATE_USER_CONTRIBUTOR_FOLLOW_SUCCESS:
            return {
                ...state,
                isUpdating: false,
                updated: true,
                data: action.data
            };
        case actionTypes.UPDATE_USER_CONTRIBUTOR_FOLLOW_FAILURE:
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