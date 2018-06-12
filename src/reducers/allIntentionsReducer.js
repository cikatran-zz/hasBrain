import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null
};

export default function allIntentionsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_ALL_INTENT:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_ALL_INTENT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            }
        case actionTypes.FETCH_ALL_INTENT_FAILURE:
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
