import * as actionTypes from '../actions/actionTypes'
import _ from 'lodash'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
    page: 1,
    noMore: false
}

export default function userHighlightReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_USER_HIGHLIGHT:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_USER_HIGHLIGHT_SUCCESS:
            let tempData = null;
            let noMore = _.isEmpty(action.data);
            if (action.page === 1) {
                tempData = action.data
            } else {
                tempData = _.concat(...state.data, action.data);
            }
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: tempData,
                page: action.page,
                noMore: noMore
            }
        case actionTypes.FETCH_USER_HIGHLIGHT_FAILURE:
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
