import * as actionTypes from '../actions/actionTypes';
import {NativeModules} from "react-native";

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
    page: 0,
    count: 0
};

export default function pathRecommendReducer(state = initialState, action) {



    switch (action.type) {
        case actionTypes.FETCHING_PATH_RECOMMEND:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_PATH_RECOMMEND_SUCCESS:
            let newData = action.data;
            if (action.page > 1) {
                newData = state.data.concat(newData);
            }
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: newData,
                count: action.count,
                page: action.page
            };
        case actionTypes.FETCH_PATH_RECOMMEND_FAILURE:
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