import * as actionTypes from '../actions/actionTypes'

const initialState = {
    removed: false,
    isRemoving: false,
    errorMessage: null,
    contentId: null
};

export default function removeBookmarkReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.REMOVING_BOOKMARK:
            return {
                ...state,
                isRemoving: true,
                contentId: null,
                removed: false,
                errorMessage: null
            };
        case actionTypes.REMOVE_BOOKMARK_SUCCESS:
            return {
                ...state,
                isRemoving: false,
                removed: true,
                errorMessage: null,
                contentId: action.contentId
            };
        case actionTypes.REMOVE_BOOKMARK_FAILURE:
            return {
                ...state,
                isRemoving: false,
                removed: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
}
