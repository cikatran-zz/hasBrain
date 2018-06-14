import * as actionTypes from '../actions/actionTypes'

const initialState = {
    created: false,
    isCreating: false,
    errorMessage: null,
    contentId: null
};

export default function createBookmarkReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.CREATING_BOOKMARK:
            return {
                ...state,
                isCreating: true,
                contentId: null,
                created: false,
                errorMessage: null
            };
        case actionTypes.CREATE_BOOKMARK_SUCCESS:
            return {
                ...state,
                isCreating: false,
                created: true,
                errorMessage: null,
                contentId: action.contentId
            };
        case actionTypes.CREATE_BOOKMARK_FAILURE:
            return {
                ...state,
                isCreating: false,
                created: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
}
