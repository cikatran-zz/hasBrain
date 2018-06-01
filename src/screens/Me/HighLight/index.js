import HighLight from './HighLight'
import { connect } from 'react-redux'
import {getUserHighLight} from '../../../actions/getUserHighLight'

function mapStateToProps(state) {
    return {
        highLight: state.userHighlightReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getHighlight: (page, perPage) => dispatch(getUserHighLight(page, perPage))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HighLight)
