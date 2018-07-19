import * as actionTypes from '../actions/actionTypes'
import {updateVisitWithInfo} from "../actions/updateVisitFreq";

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null
};

export default function lastVisitReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_LAST_VISIT:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_LAST_VISIT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: {profileId: action.profileId, visitTime: action.visitTime}
            };
        case actionTypes.FETCH_LAST_VISIT_FAILED:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
}
