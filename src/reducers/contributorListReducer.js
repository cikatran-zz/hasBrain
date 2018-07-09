import * as actionTypes from '../actions/actionTypes'
import _ from 'lodash'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null,
    chosenContributors: null,
    groupContributors: null
}

export default function contributorListReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_CONTRIBUTOR_LIST:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_CONTRIBUTOR_LIST_SUCCESS:
            let contributorListData = action.data[0].profiles;
            let followContributorData = action.data[1].data.viewer.userFollowPagination.items;
            let chosenContributors = followContributorData.map(item => {
                return item.sourceId
            });
            let groupContributors = _.groupBy(contributorListData, 'group');

            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: contributorListData,
                chosenContributors: chosenContributors,
                groupContributors: groupContributors
            }

        case actionTypes.FETCH_CONTRIBUTOR_LIST_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            }
        case actionTypes.UPDATE_USER_CONTRIBUTOR_FOLLOW:
            return {
                ...state,
                chosenContributors: action.contributors
            }
        default:
            return state
    }
}
