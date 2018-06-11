import * as actionTypes from '../actions/actionTypes'
import _ from 'lodash'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null,
    chosenSources: null,
    updating: false,
    updated: false,
    updateError: null,
    tags: null,
    tagMap: null
}

export default function sourcelistReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_SOURCE_LIST:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_SOURCE_LIST_SUCCESS:
            let chosentags = _.uniq(_.flatten(Object.values(action.data.chosenSources)));
            let tags = _.uniq(_.flatten(action.data.sourceList.items.map(item => {
                return item.categories;
            })));
            let tagMap = new Map();
            tagMap.set("All", false);
            for(let tag of tags) {
                if (_.indexOf(chosentags, tag) < 0) {
                    tagMap.set(tag, false);
                } else {
                    tagMap.set(tag, true);
                }
            }
            tags = _.concat("All", tags);
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data.sourceList,
                chosenSources: action.data.chosenSources,
                tagMap: tagMap,
                tags: tags
            }
        case actionTypes.UPDATE_USER_SOURCE_TAG:
            return {
                ...state,
                tagMap: action.tagMap
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
