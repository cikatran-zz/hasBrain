import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';
import {NativeModules} from 'react-native'

const initialState = {
    data: null,
    dataMap: null,
    fetched: false,
    isFetching: false,
    error: false
};

export default function highlightByArticleReducer(state = initialState, action) {

    switch (action.type) {
        case actionTypes.FETCHING_HIGHLIGHT_ARTICLE:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_HIGHLIGHT_ARTICLE_SUCCESS:
            // let newData = [];
            // let dataMap = new Map();
            // if (action.data) {
            //     if (!_.isEmpty(action.data.highlights)) {
            //         newData = action.data.highlights.map(x=>(x.highlight));
            //         newData = _.compact(newData);
            //         action.data.highlights.forEach((x)=>{
            //             dataMap.set(x.highlight.trim(),x._id)
            //         });
            //     }
            //
            // }

            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data,
            };
        case actionTypes.FETCH_HIGHLIGHT_ARTICLE_FAILURE:
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