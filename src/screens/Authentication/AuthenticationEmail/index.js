import AuthenticationEmail from './AuthenticationEmail'
import {connect} from 'react-redux';
import {createUser} from "../../../actions/createUser";
import {checkOnboarded, signInEmail, signUpEmail} from "../../../actions/authenticationAction";

function mapStateToProps(state) {
    return {
        authentication: state.authenticationReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: ()=> dispatch(createUser()),
        signIn: (email,password)=>dispatch(signInEmail(email, password)),
        signUp: (email, password, properties)=>dispatch(signUpEmail(email, password, properties)),
        checkOnboarded: () => dispatch(checkOnboarded())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthenticationEmail);