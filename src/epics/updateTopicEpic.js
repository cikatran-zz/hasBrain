import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { updateUserFollow } from '../api'
import { updateFollowTopicsSuccess, updateFollowTopicsFailure } from '../actions/updateFollowTopics'

const updateTopicListEpic = (action$) =>
    action$.pipe(ofType(actionTypes.UPDATING_USER_TOPIC),
        mergeMap(action =>
            from(updateUserFollow("topictype", action.topics)).pipe(
                map(response => {
                    return updateFollowTopicsSuccess()
                }),
                catchError(error => of(updateFollowTopicsFailure(error)))
            )));

export default updateTopicListEpic
