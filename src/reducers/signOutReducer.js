import * as actionTypes from '../actions/actionTypes'

const initialState = {
}

export default function signOutReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SIGN_OUT:
            return {
                ...state
            };
        default:
            return state
    }
}
