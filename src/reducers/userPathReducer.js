import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null
}

export default function userPathReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_USER_PATH:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_USER_PATH_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            }
        case actionTypes.FETCH_USER_PATH_FAILURE:
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
