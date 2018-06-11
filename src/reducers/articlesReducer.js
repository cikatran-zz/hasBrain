import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
    skip: 0,
    count: 0
};

export default function articlesReducer(state = initialState, action) {

    switch (action.type) {
        case actionTypes.FETCHING_ARTICLE:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_ARTICLE_SUCCESS:
            let newData = action.data;
            if (state.data != null && action.skip > 0) {
                newData = _.concat(state.data, newData);
            }
            let skip = newData.length;
            return {
                ...state,
                count: action.count,
                isFetching: false,
                fetched: true,
                data: newData,
                skip: skip
            };
        case actionTypes.FETCH_ARTICLE_FAILURE:
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