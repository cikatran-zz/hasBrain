import Sources from './Sources'
import {connect} from 'react-redux';
import {getSourceList} from "../../../actions/getSourceList";
import {updateSourceList} from '../../../actions/updateUserSources';
import {getFeed} from "../../../actions/getFeed";
function mapStateToProps(state) {
    return {
        source: state.sourcelistReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSourceList: () => dispatch(getSourceList()),
        updateSourceList: (sources) => dispatch(updateSourceList(sources)),
        getFeed: (page, perPage) => dispatch(getFeed(page, perPage)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sources);