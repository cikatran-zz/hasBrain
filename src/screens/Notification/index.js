import Notification from './Notification'
import {connect} from 'react-redux';
import { getNotification } from '../../actions/getNotification'

function mapStateToProps(state) {
    return {
        notification: state.notificationReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getNotification: () => dispatch(getNotification())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notification);
