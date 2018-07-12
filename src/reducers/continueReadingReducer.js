import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null
};

export default function continueReadingReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_CONTINUE_READING:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_CONTINUE_READING_SUCCESS:

            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_CONTINUE_READING_FAILURE:
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
