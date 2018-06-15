import Save from './Save'
import {connect} from 'react-redux';
import {getSaved} from '../../actions/getSaved'
import {removeBookmark} from "../../actions/removeBookmark";

function mapStateToProps(state) {
    return {
        saved: state.savedReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSaved: (page, perPage) => dispatch(getSaved(page, perPage)),
        removeBookmark: (id, type, trackingType) => (dispatch(removeBookmark(id, type, trackingType)))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Save);
