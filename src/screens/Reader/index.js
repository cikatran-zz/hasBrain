import Reader from './Reader'
import { connect } from 'react-redux'
import {createBookmark} from "../../actions/createBookmark";

function mapStateToProps(state) {
    return {
        bookmark: state.createBookmarkReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createBookmark: (id, type, trackingType) => dispatch(createBookmark(id, type, trackingType))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Reader)
