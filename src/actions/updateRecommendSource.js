import * as actionTypes from './actionTypes';

export function updateRecommendSource(personaIds) {
    return {
        type: actionTypes.UPDATING_RECOMMEND_SOURE,
        personaIds: personaIds
    }
}

export function updateRecommendSourceSuccess(data) {
    return {
        type: actionTypes.UPDATE_RECOMMEND_SOURE_SUCCESS,
        data: data,
    }
}


export function updateRecommendSourceFailure(error) {
    return {
        type: actionTypes.UPDATE_RECOMMEND_SOURE_FAILURE,
        errorMessage: error
    }
}