import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { updateRecommendSoureToProfile } from '../api'
import {
    updateRecommendSourceFailure,
    updateRecommendSourceSuccess
} from '../actions/updateRecommendSource'

const updateRecommendSourceEpic = (action$) =>
    action$.ofType(actionTypes.UPDATING_RECOMMEND_SOURE)
        .mergeMap(action =>
            Observable.from(updateRecommendSoureToProfile(action.personaIds))
                .map(response => updateRecommendSourceSuccess(response))
                .catch(error => Observable.of(updateRecommendSourceFailure(error)))
        )

export default updateRecommendSourceEpic
