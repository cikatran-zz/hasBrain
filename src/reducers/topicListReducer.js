import * as actionTypes from '../actions/actionTypes'
import _ from 'lodash'

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
    groupTopic: null
}

export default function topicListReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_TOPIC_LIST:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_TOPIC_LIST_SUCCESS:
            let topicListData = action.data[0].data.viewer.topicPagination.items;
            let followTopicData = action.data[1].data.viewer.userFollowMany;
            let chosenTopics = followTopicData.map(item => {
                return item.sourceId
            });
            let groupTopics = _.groupBy(topicListData, 'group');

            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: topicListData,
                chosenTopic: chosenTopics,
                groupTopics: groupTopics
            }

        case actionTypes.FETCH_TOPIC_LIST_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            }
        case actionTypes.UPDATING_USER_TOPIC:
            return {
                ...state,
                chosenTopics: action.topics
            }
        default:
            return state
    }
}
