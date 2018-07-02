import AuthenticationEmail from './AuthenticationEmail'
import {connect} from 'react-redux';
import {createUser} from "../../../actions/createUser";

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: ()=> dispatch(createUser()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthenticationEmail);