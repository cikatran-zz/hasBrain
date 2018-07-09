import PathRecommend from './PathRecommend'
import {connect} from 'react-redux';
import {getPathRecommend} from "../../../actions/getPathRecommend";
import {createBookmark} from "../../../actions/createBookmark";
import {removeBookmark} from "../../../actions/removeBookmark";

function mapStateToProps(state) {
    return {
        pathRecommend: state.pathRecommendReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPathRecommend: (page, perPage) => dispatch(getPathRecommend(page, perPage)),
        createBookmark: (id, type, trackingType) => dispatch(createBookmark(id, type, trackingType)),
        removeBookmark: (id, type, trackingType) => (dispatch(removeBookmark(id, type, trackingType)))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PathRecommend);