import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { updateRecommendSoureToProfile } from '../api'
import {
    updateRecommendSourceFailure,
    updateRecommendSourceSuccess
} from '../actions/updateRecommendSource'

const updateRecommendSourceEpic = (action$) =>
    action$.pipe(ofType(actionTypes.UPDATING_RECOMMEND_SOURE),
        mergeMap(action =>
            from(updateRecommendSoureToProfile(action.personaIds)).pipe(
                map(response => updateRecommendSourceSuccess(response)),
                catchError(error => of(updateRecommendSourceFailure(error)))
            )));

export default updateRecommendSourceEpic
