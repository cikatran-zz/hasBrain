import * as actionTypes from './actionTypes'

export function getTopicList() {
    return {
        type: actionTypes.FETCHING_TOPIC_LIST,
    }
}

export function getTopicListSuccess(data) {
    return {
        type: actionTypes.FETCH_TOPIC_LIST_SUCCESS,
        data: data,
    }
}

export function getTopicListFailure(error) {
    return {
        type: actionTypes.FETCH_TOPIC_LIST_FAILURE,
        errorMessage: error
    }
}
