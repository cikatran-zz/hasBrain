import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false
}

export default function oownpathReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_OWNPATH:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_OWNPATH_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            }
        case actionTypes.FETCH_OWNPATH_FAILURE:
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
