import Onboarding from './Onboarding'
import { connect } from 'react-redux'
import {getOnboarding} from "../../actions/getOnboarding";
import {getIntents} from "../../actions/getIntention";
import {updateRecommendSource} from "../../actions/updateRecommendSource";
import {getAllIntents} from "../../actions/getAllIntention";

function mapStateToProps(state) {
    return {
        onboarding: state.onboardingReducer,
        intentions: state.intentionsReducer,
        allIntentions: state.allIntentionsReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getOnboarding: () => dispatch(getOnboarding()),
        getIntentions: (segments) => dispatch(getIntents(segments)),
        getAllIntentions: ()=>dispatch(getAllIntents()),
        updateRecommendSource: (personaIds) => dispatch(updateRecommendSource(personaIds))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Onboarding)