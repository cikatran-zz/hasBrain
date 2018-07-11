import * as actionTypes from '../actions/actionTypes'
import _ from 'lodash';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    created: false,
    isCreating: false,
    removed: false,
    isRemoving: false,
    error: false
};

export default function bookmarkedReducer(state = initialState, action) {
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
        case actionTypes.CREATING_BOOKMARK:
            return {
                ...state,
                isCreating: true,
                contentId: null,
                created: false,
                errorMessage: null
            };
        case actionTypes.CREATE_BOOKMARK_SUCCESS:
            let newData = _.get(state.data, "articles");
            if (_.isEmpty(newData)) {
                newData = [];
            }
            newData = newData.concat([action.contentId]);
            return {
                ...state,
                isCreating: false,
                created: true,
                errorMessage: null,
                data: {paths: state.data.paths, articles: newData}
            };
        case actionTypes.CREATE_BOOKMARK_FAILURE:
            return {
                ...state,
                isCreating: false,
                created: true,
                errorMessage: action.errorMessage
            };
        case actionTypes.REMOVING_BOOKMARK:
            return {
                ...state,
                isRemoving: true,
                contentId: null,
                removed: false,
                errorMessage: null
            };
        case actionTypes.REMOVE_BOOKMARK_SUCCESS:
            let oldData = _.get(state.data, "articles");
            if (_.isEmpty(oldData)) {
                oldData = [];
            }
            _.remove(oldData, function(n) {
                return n === action.contentId;
            });
            return {
                ...state,
                isRemoving: false,
                removed: true,
                errorMessage: null,
                data: {paths: state.data.paths, articles: oldData}
            };
        case actionTypes.REMOVE_BOOKMARK_FAILURE:
            return {
                ...state,
                isRemoving: false,
                removed: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
}
