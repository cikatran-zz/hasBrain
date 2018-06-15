import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getSaved } from '../api'
import { getSavedFailure, getSavedSuccess } from '../actions/getSaved'
import {strings} from "../constants/strings";

const getSavedEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_SAVED)
        .mergeMap(action =>
            Observable.from(getSaved(action.page, action.perPage, strings.bookmarkType.article))
                .map(response => {
                    return getSavedSuccess(response.data, action.page)
                })
                .catch(error => Observable.of(getSavedFailure(error)))
        )

export default getSavedEpic
