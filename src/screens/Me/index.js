import Me from './Me'
import { connect } from 'react-redux'
import {getUserProfile, getUserAnalyst, updateUserProfile, getUserName} from '../../actions/userProfileAction'
import {signOut} from "../../actions/signOut";

function mapStateToProps(state) {
    return {
        user: state.userProfileReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserProfile: () => dispatch(getUserProfile()),
        getUserName: () => dispatch(getUserName()),
        getUserAnalyst: () => dispatch(getUserAnalyst()),
        updateUserProfile: (role, summary) => dispatch(updateUserProfile(role, summary)),
        signOut: ()=>dispatch(signOut())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Me)
