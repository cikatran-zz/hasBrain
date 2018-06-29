import Sources from './Sources'
import {connect} from 'react-redux';
import {getSourceList} from "../../../actions/getSourceList";
import {updateSourceList} from '../../../actions/updateUserSources';
function mapStateToProps(state) {
    return {
        source: state.sourcelistReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSourceList: () => dispatch(getSourceList()),
        updateSourceList: (sources) => dispatch(updateSourceList(sources)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sources);