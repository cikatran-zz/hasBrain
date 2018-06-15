import Reader from './Reader'
import { connect } from 'react-redux'
import {createBookmark} from "../../actions/createBookmark";
import {removeBookmark} from "../../actions/removeBookmark";
import {getWatchingHistory} from "../../actions/getWatchingHistory";

function mapStateToProps(state) {
    return {
        watchingHistory: state.watchingHistoryReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createBookmark: (id, type, trackingType) => dispatch(createBookmark(id, type, trackingType)),
        removeBookmark: (id, type, trackingType) => dispatch(removeBookmark(id, type, trackingType)),
        getWatchingHistory: (contentId) => dispatch(getWatchingHistory(contentId))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Reader)
