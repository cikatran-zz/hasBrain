import * as actionTypes from '../actions/actionTypes'
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { getSaved } from '../api'
import { getSavedFailure, getSavedSuccess } from '../actions/getSaved'
import {strings} from "../constants/strings";

const getSavedEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_SAVED),
        mergeMap(action =>
            from(getSaved(action.page, action.perPage, strings.bookmarkType.article)).pipe(
                map(response => {
                    return getSavedSuccess(response.data, action.page)
                }),
                catchError(error => of(getSavedFailure(error)))
            )));

export default getSavedEpic
