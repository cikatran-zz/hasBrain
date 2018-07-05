import * as actionTypes from './actionTypes'

export function updateFollowContributor(contributors) {
    return {
        type: actionTypes.UPDATE_USER_CONTRIBUTOR_FOLLOW,
        contributors: contributors
    }
}
export function updateFollowContributorSuccess(data) {
    return {
        type: actionTypes.UPDATE_USER_CONTRIBUTOR_FOLLOW_SUCCESS,
        data: data,
    }
}

export function updateFollowContributorFailure(error) {
    return {
        type: actionTypes.UPDATE_USER_CONTRIBUTOR_FOLLOW_FAILURE,
        errorMessage: error
    }
}