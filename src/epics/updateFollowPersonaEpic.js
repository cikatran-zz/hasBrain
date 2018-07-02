import * as actionTypes from '../actions/actionTypes';
import {updateFollowPersonaSuccess, updateFollowPersonaFailure} from '../actions/updateFollowPersona';
import {followByPersonas} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';

const updateFollowPersonaEpic = (action$) =>
    action$.pipe(ofType(actionTypes.UPDATING_FOLLOW_PERSONA),
        mergeMap(action =>
            from(followByPersonas(action.ids)).pipe(
                map(response => updateFollowPersonaSuccess(response.data)),
                catchError(error => of(updateFollowPersonaFailure(error)))
            )));

export default updateFollowPersonaEpic;