import * as actionTypes from '../actions/actionTypes'

const initialState = {
    created: false,
    isCreating: false,
    errorMessage: null
};

export default function createUserReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.CREATING_USER:
            return {
                ...state,
                isCreating: true
            };
        case actionTypes.CREATE_USER_SUCCESS:
            return {
                ...state,
                isCreating: false,
                created: true,
                errorMessage: null
            };
        case actionTypes.CREATE_USER_FAILURE:
            return {
                ...state,
                isCreating: false,
                created: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
}
