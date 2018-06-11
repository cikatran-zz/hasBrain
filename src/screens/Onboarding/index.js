import Onboarding from './Onboarding'
import { connect } from 'react-redux'
import {getOnboarding} from "../../actions/getOnboarding";
import {getIntents} from "../../actions/getIntention";
import {updateRecommendSource} from "../../actions/updateRecommendSource";

function mapStateToProps(state) {
    return {
        onboarding: state.onboardingReducer,
        intentions: state.intentionsReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getOnboarding: () => dispatch(getOnboarding()),
        getIntentions: (segments) => dispatch(getIntents(segments)),
        updateRecommendSource: (personaIds) => dispatch(updateRecommendSource(personaIds))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Onboarding)