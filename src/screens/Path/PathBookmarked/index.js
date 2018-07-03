import PathBookmarked from './PathBookmarked'
import {connect} from 'react-redux';
import {getPathBookmarked} from "../../../actions/getPathBookmarked";
import {removeBookmark} from "../../../actions/removeBookmark";
import {getOwnpath} from "../../../actions/getOwnpath";

function mapStateToProps(state) {
    return {
        pathBookmarked: state.pathBookmarkedReducer,
        ownpath: state.ownpathReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPathBookmarked: (page, perPage) => dispatch(getPathBookmarked(page, perPage)),
        getOwnpath: ()=>dispatch(getOwnpath()),
        removeBookmark: (id, type, trackingType) => (dispatch(removeBookmark(id, type, trackingType)))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PathBookmarked);