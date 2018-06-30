import * as actionTypes from './actionTypes'

export function updateFollowTopics(topics) {
    return {
        type: actionTypes.UPDATING_USER_TOPIC,
        topics: topics
    }
}

export function updateFollowTopicsSuccess(data) {
    return {
        type: actionTypes.UPDATE_USER_TOPIC_SUCCESS,
        data: data,
    }
}

export function updateFollowTopicsFailure(error) {
    return {
        type: actionTypes.UPDATE_USER_TOPIC_FAILURE,
        errorMessage: error
    }
}