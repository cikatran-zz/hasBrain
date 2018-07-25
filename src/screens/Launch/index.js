import Launch from './Launch'
import {connect} from 'react-redux';
import {createUser} from "../../actions/createUser";
import {checkOnboarded, checkSignIn} from "../../actions/authenticationAction";

function mapStateToProps(state) {
    return {
        authentication: state.authenticationReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: () => dispatch(createUser()),
        checkSignIn: () => dispatch(checkSignIn()),
        checkOnboarded: () => dispatch(checkOnboarded())
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Launch);