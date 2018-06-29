import MySource from './MySource'
import {connect} from 'react-redux';
function mapStateToProps(state) {
    return {
        // source: state.sourcelistReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // getSourceList: () => dispatch(getSourceList()),
        // updateSourceList: (sources) => dispatch(updateSourceList(sources)),
        // getFeed: (page, perPage) => dispatch(getFeed(page, perPage)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MySource);