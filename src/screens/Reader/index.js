import Reader from './Reader'
import { connect } from 'react-redux'
import {trackEvent} from "../../actions/trackEvent";
import {createBookmark} from "../../actions/createBookmark";

function mapStateToProps(state) {
    return {
        bookmark: state.createBookmarkReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        trackEvent: (name, properties) => dispatch(trackEvent(name, properties)),
        createBookmark: (id, type, trackingType) => dispatch(createBookmark(id, type, trackingType))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Reader)
