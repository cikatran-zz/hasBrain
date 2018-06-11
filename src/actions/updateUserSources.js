import * as actionTypes from './actionTypes'

export function updateSourceList(sources) {
    return {
        type: actionTypes.UPDATING_USER_SOURCES,
        sources: sources
    }
}

export function updateSourceListSuccess(data) {
    return {
        type: actionTypes.UPDATE_USER_SOURCES_SUCCESS,
        data: data,
    }
}

export function updateSourceListFailure(error) {
    return {
        type: actionTypes.UPDATE_USER_SOURCES_FAILURE,
        errorMessage: error
    }
}

export function updateUserSourceTag(tagMap) {
    return {
        type: actionTypes.UPDATE_USER_SOURCE_TAG,
        tagMap: tagMap
    }
}
