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
    tagMap: new Map(),
}

export default function sourcelistReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_SOURCE_LIST:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_SOURCE_LIST_SUCCESS:
            let sourceListData = action.data[0].data.viewer.sourcePagination.items;
            let followSourceData = action.data[1].data.viewer.userFollowMany;
            let followCategoryData = action.data[2].data.viewer.userFollowMany;
            let chosentags = followCategoryData.map(item => {
                return item.sourceId
            });
            let chosenSources = followSourceData.map(item => {
                return item.sourceId
            });

            let tags = _.uniq(_.flatten(sourceListData.map(item => {
                return item.categories;
            })));
            let tagMap = new Map();
            tagMap.set("All", false);
            let count = 0;
            for(let tag of tags) {
                if (_.isEmpty(chosentags)) {
                    tagMap.set(tag, true);
                    count++;
                } else {
                    if (_.indexOf(chosentags, tag) < 0) {
                        tagMap.set(tag, false);
                    } else {
                        tagMap.set(tag, true);
                        count++;
                    }
                }
            }
            //increase the count to check if all tags are chosen, then turn on All tag
            if (count == tags.length){
                tagMap.set("All", true);
                for(let tag of tags) {
                    tagMap.set(tag, false);
                }
            }
            tags = _.concat("All", tags);
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: sourceListData,
                chosenSources: chosenSources,
                tagMap: tagMap,
                tags: tags,
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
                updating: true,
                chosenSources: action.sources
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
