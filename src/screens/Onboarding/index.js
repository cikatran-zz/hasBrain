import Onboarding from './Onboarding'
import { connect } from 'react-redux'
import {getOnboarding} from "../../actions/getOnboarding";

function mapStateToProps(state) {
    return {
        onboarding: state.onboardingReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getOnboarding: () => dispatch(getOnboarding())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Onboarding)