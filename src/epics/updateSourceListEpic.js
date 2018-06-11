import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { updateSourceList } from '../api'
import { updateSourceListSuccess, updateSourceListFailure } from '../actions/updateUserSources'

const updateSourceListEpic = (action$) =>
    action$.ofType(actionTypes.UPDATING_USER_SOURCES)
        .mergeMap(action =>
            Observable.from(updateSourceList(action.sources))
                .map(response => {
                    return updateSourceListSuccess()
                })
                .catch(error => Observable.of(updateSourceListFailure(error)))
        )

export default updateSourceListEpic
