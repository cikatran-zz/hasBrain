import Reader from './Reader'
import { connect } from 'react-redux'

function mapStateToProps(state) {
    return {
        // Reader: state.ReaderReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // getReader: () => dispatch(getReader())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Reader)
