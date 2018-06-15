import PathBookmarked from './PathBookmarked'
import {connect} from 'react-redux';
import {getPathBookmarked} from "../../../actions/getPathBookmarked";
import {removeBookmark} from "../../../actions/removeBookmark";

function mapStateToProps(state) {
    return {
        pathBookmarked: state.pathBookmarkedReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPathBookmarked: (page, perPage) => dispatch(getPathBookmarked(page, perPage)),
        removeBookmark: (id, type, trackingType) => (dispatch(removeBookmark(id, type, trackingType)))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PathBookmarked);