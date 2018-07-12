import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';
import {NativeModules} from 'react-native'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false
};

export default function articleDetailReducer(state = initialState, action) {

    switch (action.type) {
        case actionTypes.FETCHING_ARTICLE_DETAIL_BY_URL:
        case actionTypes.FETCHING_ARTICLE_DETAIL:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_ARTICLE_DETAIL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_ARTICLE_DETAIL_FAILURE:
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