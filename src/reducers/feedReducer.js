import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';
import {NativeModules, Platform} from "react-native";

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
    page: 0,
    count: 0,
    rank: null
};

export default function feedReducer(state = initialState, action) {

    switch (action.type) {
        case actionTypes.FETCHING_FEED:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_FEED_SUCCESS:
            let newData = action.data;
            if (state.data != null && action.rank != null) {
                newData = state.data.concat(newData);//_.union(state.data, newData);
            }
            let listUrl = newData.map(item => item.contentData.contentId);
            NativeModules.RNURLCache.cacheUrls(listUrl);
            //(Platform.OS !== "ios") &&
            let rank = null;
            if (newData != null && newData.length > 0) {
                rank = newData[newData.length -1].rank
            }
            return {
                ...state,
                count: action.count,
                isFetching: false,
                fetched: true,
                data: newData,
                page: action.page,
                rank: rank
            };
        case actionTypes.FETCH_FEED_FAILURE:
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