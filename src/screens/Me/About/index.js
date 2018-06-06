import About from './About'
import { connect } from 'react-redux'
import {getUserAnalyst} from '../../../actions/userProfileAction'


function mapStateToProps(state) {
    return {
        user: state.userProfileReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserAnalyst: () => dispatch(getUserAnalyst()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(About)
