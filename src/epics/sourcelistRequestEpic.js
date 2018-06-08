import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getSourceList } from '../api'
import { getSourceListSuccess, getSourceListFailure } from '../actions/getSourceList'

const getSourceListEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_SOURCE_LIST)
        .mergeMap(action =>
            Observable.from(getSourceList())
                .map(response => {
                    return getSourceListSuccess(response.data)
                })
                .catch(error => Observable.of(getSourceListFailure(error)))
        )

export default getSourceListEpic
