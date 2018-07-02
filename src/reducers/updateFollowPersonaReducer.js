import * as actionTypes from '../actions/actionTypes'

const initialState = {
    updated: false,
    isUpdating: false,
    errorMessage: null
};

export default function udateFollowPersonaReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.UPDATING_FOLLOW_PERSONA:
            return {
                ...state,
                isUpdating: true
            };
        case actionTypes.UPDATE_FOLLOW_PERSONA_SUCCESS:
            return {
                ...state,
                isUpdating: false,
                updated: true,
                errorMessage: null
            };
        case actionTypes.UPDATE_FOLLOW_PERSONA_FAILURE:
            return {
                ...state,
                isUpdating: false,
                updated: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
}
