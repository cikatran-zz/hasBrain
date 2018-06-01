import About from './About'
import { connect } from 'react-redux'


function mapStateToProps(state) {
    return {
        user: state.userProfileReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(About)
