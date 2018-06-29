import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of, forkJoin} from 'rxjs';
import { ofType } from 'redux-observable';
import { getTopicList, getUserFollow } from '../api'
import { getTopicListSuccess, getTopicListFailure } from '../actions/getTopicList'

const getTopicListEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_SOURCE_LIST),
        mergeMap(action =>
            forkJoin([getTopicList(), getUserFollow("topictype")]).pipe(
                map(response => {
                    return getTopicListSuccess(response)
                }),
                catchError(error => of(getTopicListFailure(error)))
            )));

export default getTopicListEpic
