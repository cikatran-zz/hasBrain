import PathBookmarked from './PathBookmarked'
import {connect} from 'react-redux';
import {getPathBookmarked} from "../../../actions/getPathBookmarked";

function mapStateToProps(state) {
    return {
        pathBookmarked: state.pathBookmarkedReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPathBookmarked: (page, perPage) => dispatch(getPathBookmarked(page, perPage))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PathBookmarked);