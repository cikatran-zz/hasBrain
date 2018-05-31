import About from './About'
import { connect } from 'react-redux'

function mapStateToProps(state) {
    return {
        // me: state.notificationReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // getMe: () => dispatch(getMe())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(About)
