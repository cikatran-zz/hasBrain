import UserPath from './UserPath'
import { connect } from 'react-redux'
import {getUserPath} from '../../actions/getUserPath'


function mapStateToProps(state) {
    return {
        userPath: state.userPathReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserPath: (pathId) => dispatch(getUserPath(pathId))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPath)
