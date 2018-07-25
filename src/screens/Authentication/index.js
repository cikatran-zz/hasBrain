import Authentication from './Authentication'
import {connect} from 'react-redux';
import {createUser} from "../../actions/createUser";
import {checkOnboarded, logInFacebook, logInGoogle} from "../../actions/authenticationAction";

function mapStateToProps(state) {
    return {
        authentication: state.authenticationReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: ()=> dispatch(createUser()),
        logInWithFacebook: ()=>dispatch(logInFacebook()),
        logInWithGoogle: ()=>dispatch(logInGoogle()),
        checkOnboarded: () => dispatch(checkOnboarded())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Authentication);