import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getOnboardingInfo } from '../api'
import { getOnboardingFailure, getOnboardingSuccess } from '../actions/getOnboarding'

const getOnboardingEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_ONBOARDING)
        .mergeMap(action =>
            Observable.from(getOnboardingInfo())
                .map(response => getOnboardingSuccess(response))
                .catch(error => Observable.of(getOnboardingFailure(error)))
        )

export default getOnboardingEpic
