import MySource from './MySource'
import {connect} from 'react-redux';
import {getSourceList} from "../../actions/getSourceList";
function mapStateToProps(state) {
    return {
        source: state.sourcelistReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSourceList: () => dispatch(getSourceList())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MySource);