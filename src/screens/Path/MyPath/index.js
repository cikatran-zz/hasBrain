import MyPath from './MyPath'
import {connect} from 'react-redux';
import {getPathCurrent} from "../../../actions/getPathCurrent";

function mapStateToProps(state) {
    return {
        pathCurrent: state.pathCurrentReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPathCurrent: () => dispatch(getPathCurrent()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyPath);