import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null
};

export default function intentionsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_WATCHING_HISTORY:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_WATCHING_HISTORY_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_WATCHING_HISTORY_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
}
