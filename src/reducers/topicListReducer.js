import * as actionTypes from '../actions/actionTypes'
import _ from 'lodash'
import {STAGING} from "../constants/environment";

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null,
    chosenTopic: null,
    updating: false,
    updated: false,
    updateError: null,
    followTopics: null,
    groupTopic: null,
    tagTitle: new Map()
}

export default function topicListReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_TOPIC_LIST:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_TOPIC_LIST_SUCCESS:
            let topicListData = [];
            if (STAGING) {
                topicListData = action.data[0].data.viewer.topicSearch.hits
            } else {
                topicListData = action.data[0].data.viewer.topicPagination.items;
            }
            let followTopicData = action.data[1].data.viewer.userFollowPagination.items;
            let chosenTopics = followTopicData.map(item => {
                let isExisted = topicListData.find((x)=>{
                    return x._id === item.sourceId
                });
                if (isExisted) {
                    return item.sourceId;
                } else {
                    return null;
                }

            });
            chosenTopics = _.compact(chosenTopics);
            let groupTopics = {};
            if (!STAGING) {
                groupTopics = _.groupBy(topicListData, 'group');
            } else {
                groupTopics = {'': topicListData};
            }
            let tagTitle = new Map();
            if (!STAGING) {
                topicListData.forEach((x)=>{
                    tagTitle.set(x._id, x.title);
                });
            } else {
                topicListData.forEach((x)=>{
                    tagTitle.set(x._id, _.get(x,'_source.gitlabUserName', '') + '/' + _.get(x, '_source.title'))
                });
            }


            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: topicListData,
                chosenTopic: chosenTopics,
                groupTopics: groupTopics,
                tagTitle: tagTitle
            }

        case actionTypes.FETCH_TOPIC_LIST_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage,
                tagTitle: new Map()
            }
        case actionTypes.UPDATING_USER_TOPIC:
            return {
                ...state,
                chosenTopic: action.topics
            }
        default:
            return state
    }
}
