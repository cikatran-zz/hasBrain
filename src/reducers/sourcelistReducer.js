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
    tagTitle: new Map()
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
            let followSourceData = action.data[1].data.viewer.userFollowPagination.items;
            let followTopicData = action.data[2].data.viewer.userFollowPagination.items;
            let chosenTopicData = action.data[3];
            let chosenSources = followSourceData.map(item => {
                return item.sourceId
            });

            let tags = followTopicData.map((x)=>x.sourceId);
            let tagTitle = new Map();
            followTopicData.forEach((x)=>{
                tagTitle.set(x.sourceId, _.get(x,'topicData.title'));
            });
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
            if (count === 0 || count === tags.length){
                tagMap.set("ALL", true);
                for (let tag of tags) {
                    tagMap.set(tag, false);
                }
            }
            tags = _.concat("ALL", tags);
            console.log("Tag map", tagMap, tags, count);
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: sourceListData,
                chosenSources: chosenSources,
                tagMap: tagMap,
                tags: tags,
                tagTitle: tagTitle
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

            console.log("topics",newTags, state.tagMap.keys());
            let newTagMap = new Map();
            let countTag = 0;
            let newTags = action.topics;
            for (let [key, value] of state.tagMap) {
                if (newTags.indexOf(key) !== -1) {
                    newTagMap.set(key,value);
                    countTag += value ? 1 : 0;
                }
            }
            if (countTag === 0 || countTag === action.topics.length) {
                newTagMap.set("ALL", true);
                for (let key of newTags) {
                    newTagMap.set(key, false);
                }
            }
            newTags = _.concat("ALL", newTags);
            console.log(countTag, newTagMap);
            return {
                ...state,
                tags: newTags,
                tagMap: newTagMap
            };
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
