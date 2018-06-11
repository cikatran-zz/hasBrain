import Path from './Path'
import { connect } from 'react-redux'
import {getUserPath} from '../../actions/getUserPath'


function mapStateToProps(state) {
    return {
        userPath: state.userPathReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserPath: () => dispatch(getUserPath())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Path)
