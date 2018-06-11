import PathRecommend from './PathRecommend'
import {connect} from 'react-redux';
import {getPathRecommend} from "../../../actions/getPathRecommend";

function mapStateToProps(state) {
    return {
        pathRecommend: state.pathRecommendReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPathRecommend: (page, perPage) => dispatch(getPathRecommend(page, perPage))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PathRecommend);