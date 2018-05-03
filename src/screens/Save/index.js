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
        getSaved: () => dispatch(getSaved())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Save);
