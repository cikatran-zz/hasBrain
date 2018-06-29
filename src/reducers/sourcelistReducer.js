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
            let followTopicData = action.data[2].data.viewer.userFollowMany;
            let chosenTopicData = action.data[3];
            let chosenSources = followSourceData.map(item => {
                return item.sourceId
            });

            let tags = followTopicData.map((x)=>x.sourceId);
            let tagMap = new Map();
            tagMap.set("ALL", false);
            let count = 0;
            for(let tag of tags) {
                if (_.isEmpty(chosenTopicData)) {
                    tagMap.set(tag, true);
                    count++;
                } else {
                    if (_.indexOf(chosenTopicData, tag) < 0) {
                        tagMap.set(tag, false);
                    } else {
                        tagMap.set(tag, true);
                        count++;
                    }
                }
            }
            //increase the count to check if all tags are chosen, then turn on All tag
            if (count == tags.length){
                tagMap.set("ALL", true);
                for(let tag of tags) {
                    tagMap.set(tag, false);
                }
            }
            tags = _.concat("ALL", tags);
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
        case actionTypes.UPDATING_USER_TOPIC:
            let newTags = _.concat("ALL", action.topics);
            return {
                ...state,
                tags: newTags
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
