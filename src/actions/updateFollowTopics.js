import * as actionTypes from './actionTypes'

export function updateFollowTopics(topics) {
    return {
        type: actionTypes.UPDATING_USER_TOPIC,
        topics: topics
    }
}

export function updateFollowTopicsSuccess(data) {
    return {
        type: actionTypes.FETCHING_FEED,
        page: 1,
        perPage: 10,
        rank: null,
        topics: data
    }
    // return {
    //     type: actionTypes.UPDATE_USER_TOPIC_SUCCESS,
    //     data: data,
    // }
}

export function updateFollowTopicsFailure(error) {
    return {
        type: actionTypes.UPDATE_USER_TOPIC_FAILURE,
        errorMessage: error
    }
}