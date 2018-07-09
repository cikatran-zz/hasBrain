import * as actionTypes from './actionTypes'
import _ from 'lodash';

export function getUserPath(id) {
    return {
        type: actionTypes.FETCHING_USER_PATH,
        pathId: id
    }
}

export function getUserPathSuccess(data) {
    let response = _.get(data, 'viewer.pathPagination.items',[]);
    if (_.isEmpty(response)) {
        response = null
    } else {
        response = response[0]
    }
    return {
        type: actionTypes.FETCH_USER_PATH_SUCCESS,
        data: response,
    }
}

export function getUserPathFailure(error) {
    return {
        type: actionTypes.FETCH_USER_PATH_FAILURE,
        errorMessage: error
    }
}
