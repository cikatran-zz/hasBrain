import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null,
    chosenSources: null,
    updating: false,
    updated: false,
    updateError: null
}

export default function sourcelistReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_SOURCE_LIST:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_SOURCE_LIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data.sourceList,
                chosenSources: action.data.chosenSources
            }
        case actionTypes.FETCH_SOURCE_LIST_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            }
        case actionTypes.UPDATING_USER_SOURCES:
            return {
                ...state,
                updating: true
            }
        case actionTypes.UPDATE_USER_SOURCES_SUCCESS:
            return {
                ...state,
                updating: false,
                updated: true
            }
        case actionTypes.UPDATE_USER_SOURCES_FAILURE:
            return {
                ...state,
                updated: true,
                updating: false,
                updateError: action.errorMessage
            }
        default:
            return state
    }
}
