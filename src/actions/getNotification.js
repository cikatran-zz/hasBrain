import * as actionTypes from './actionTypes'

export function getNotification() {
    return {
        type: actionTypes.FETCHING_NOTIFICATION
    }
}

export function getNotificationSuccess(data) {
    return {
        type: actionTypes.FETCH_NOTIFICATION_SUCCESS,
        data: data.result
    }
}

export function getNotificationFailure(error) {
    return {
        type: actionTypes.FETCH_NOTIFICATION_FAILURE,
        errorMessage: error
    }
}
