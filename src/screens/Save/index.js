import Save from './Save'
import {connect} from 'react-redux';
import {getSaved} from '../../actions/getSaved'
import {removeBookmark} from "../../actions/removeBookmark";
import {createBookmark} from "../../actions/createBookmark";
import {getBookmarkedIds} from "../../actions/getBookmarkedIds";

function mapStateToProps(state) {
    return {
        saved: state.savedReducer,
        bookmarkedIds: state.bookmarkedReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSaved: (page, perPage) => dispatch(getSaved(page, perPage)),
        removeBookmark: (id, type, trackingType) => (dispatch(removeBookmark(id, type, trackingType, dispatch))),
        createBookmark: (id, type, trackingType) => dispatch(createBookmark(id, type, trackingType, dispatch)),
        getBookmarkedIds: () => dispatch(getBookmarkedIds()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Save);
