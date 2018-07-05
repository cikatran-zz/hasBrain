import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { getOnboardingInfo } from '../api'
import { getOnboardingFailure, getOnboardingSuccess } from '../actions/getOnboarding'

const getOnboardingEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_ONBOARDING),
        mergeMap(action =>
            from(getOnboardingInfo()).pipe(
                map(response => getOnboardingSuccess(response)),
                catchError(error => of(getOnboardingFailure(error)))
            )));

export default getOnboardingEpic
