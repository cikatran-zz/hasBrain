import * as actionTypes from './actionTypes'

export function updateVisitFreq(dispatch) {
    return {
        type: actionTypes.FETCHING_LAST_VISIT,
        dispatcher: dispatch
    }
}

export function getLastVisitSuccess(data, dispatch) {
    return {
        type: actionTypes.FETCH_LAST_VISIT_SUCCESS,
        profileId: data.viewer.me.profileId,
        visitTime: data.viewer.me.lastVisitedAt,
        dispatcher: dispatch
    }
}


export function getLastVisitFailed(error) {
    return {
        type: actionTypes.FETCH_LAST_VISIT_FAILED,
        errorMessage: error
    }
}

export function updateVisitWithInfo(profile, visitTime, freq) {
    return {
        type: actionTypes.UPDATING_VISIT_FREQ,
        profileId:profile,
        visitTime: visitTime,
        freq: freq
    }
}

export function updateVisitWithInfoSuccess(data) {
    return {
        type: actionTypes.UPDATE_VISIT_FREQ_SUCCESS,
        data: data,
    }
}

export function updateVisitWithInfoFailure(error) {
    return {
        type: actionTypes.UPDATE_VISIT_FREQ_FAILURE,
        errorMessage: error
    }
}

