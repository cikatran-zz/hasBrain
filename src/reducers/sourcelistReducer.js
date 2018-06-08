import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null,
    chosenSources: null
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
        default:
            return state
    }
}
