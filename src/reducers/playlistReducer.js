import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function playlistReducer(state = initialState, action) {

    switch (action.type) {
        case actionTypes.FETCHING_PLAYLIST:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data,
                title: action.title
            };
        case actionTypes.FETCH_PLAYLIST_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                error: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
};