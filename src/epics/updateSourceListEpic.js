import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { updateSourceList } from '../api'
import { updateSourceListSuccess, updateSourceListFailure } from '../actions/updateUserSources'

const updateSourceListEpic = (action$) =>
    action$.pipe(ofType(actionTypes.UPDATING_USER_SOURCES),
        mergeMap(action =>
            from(updateSourceList(action.sources)).pipe(
                map(response => {
                    return updateSourceListSuccess()
                }),
                catchError(error => of(updateSourceListFailure(error)))
            )));

export default updateSourceListEpic
