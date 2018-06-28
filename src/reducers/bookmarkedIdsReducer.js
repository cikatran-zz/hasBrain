import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false
};

export default function bookmarkedIdsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_BOOKMARKEDIDS:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_BOOKMARKEDIDS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_BOOKMARKEDIDS_FAILURE:
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
