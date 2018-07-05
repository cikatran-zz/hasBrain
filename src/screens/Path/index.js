import Path from './Path'
import { connect } from 'react-redux'
import {getUserPath} from '../../actions/getUserPath'
import {getPathCurrent} from "../../actions/getPathCurrent";
import {getPathRecommend} from "../../actions/getPathRecommend";


function mapStateToProps(state) {
    return {
        pathCurrent: state.pathCurrentReducer,
        pathRecommend: state.pathRecommendReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPathCurrent: () => dispatch(getPathCurrent()),
        getPathRecommend: (page, perPage) => dispatch(getPathRecommend(page, perPage)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Path)
