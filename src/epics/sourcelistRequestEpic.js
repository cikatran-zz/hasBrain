import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of, forkJoin} from 'rxjs';
import { ofType } from 'redux-observable';
import {getChosenTopics, getSourceList, getUserFollow} from '../api'
import { getSourceListSuccess, getSourceListFailure } from '../actions/getSourceList'

const getSourceListEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_SOURCE_LIST),
        mergeMap(action =>
            forkJoin([getSourceList(), getUserFollow("sourcetype"), getUserFollow("topictype"), getChosenTopics()]).pipe(
                map(response => {
                    return getSourceListSuccess(response)
                }),
                catchError(error => of(getSourceListFailure(error)))
            )));

export default getSourceListEpic
