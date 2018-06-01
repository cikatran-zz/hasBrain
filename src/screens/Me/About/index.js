import About from './About'
import { connect } from 'react-redux'
import {getUserProfile, getUserAnalyst, updateUserProfile} from '../../../actions/userProfileAction'

function mapStateToProps(state) {
    return {
        user: state.userProfileReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserProfile: () => dispatch(getUserProfile()),
        getUserAnalyst: () => dispatch(getUserAnalyst()),
        updateUserProfile: (role, summary) => dispatch(updateUserProfile(role, summary))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(About)
