import * as actionTypes from './actionTypes';

export function getContinueReading(maximumNumber=10) {
    return {
        type: actionTypes.FETCHING_CONTINUE_READING,
        maximum: maximumNumber
    }
}

export function getContinueReadingSuccess(data) {
    return {
        type: actionTypes.FETCH_CONTINUE_READING_SUCCESS,
        data: data,
    }
}


export function getContinueReadingFailure(error) {
    return {
        type: actionTypes.FETCH_CONTINUE_READING_FAILURE,
        errorMessage: error
    }
}