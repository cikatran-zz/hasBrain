import Save from './Save'
import {connect} from 'react-redux';
import {getSaved} from '../../actions/getSaved'

function mapStateToProps(state) {
    return {
        saved: state.savedReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSaved: (page, perPage) => dispatch(getSaved(page, perPage))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Save);
