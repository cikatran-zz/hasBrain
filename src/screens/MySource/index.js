import MySource from './MySource'
import {connect} from 'react-redux';
import {getSourceList} from "../../actions/getSourceList";
import {updateSourceList} from '../../actions/updateUserSources';
import {getArticles} from "../../actions/getArticles";
function mapStateToProps(state) {
    return {
        source: state.sourcelistReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSourceList: () => dispatch(getSourceList()),
        updateSourceList: (sources) => dispatch(updateSourceList(sources)),
        getArticles: (limit, skip, sources, tags) => dispatch(getArticles(limit, skip, sources, tags)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MySource);