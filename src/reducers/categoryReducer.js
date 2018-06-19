import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    errorMessage: null
};

export default function categoryReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_CATEGORY:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_CATEGORY_SUCCESS:
            let newData = [];

            if (action.data != null) {
                newData = action.data.map((x)=>x.title);
            }

            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: newData
            }
        case actionTypes.FETCH_CATEGORY_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            }
        default:
            return state
    }
}
