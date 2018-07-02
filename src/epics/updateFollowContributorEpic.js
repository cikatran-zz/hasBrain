import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { updateUserFollow } from '../api'
import { updateFollowContributorFailure, updateFollowContributorSuccess } from '../actions/updateFollowContributor'

const updateFollowContributorListEpic = (action$) =>
    action$.pipe(ofType(actionTypes.UPDATE_USER_CONTRIBUTOR_FOLLOW),
        mergeMap(action =>
            from(updateUserFollow("contributortype", action.contributors)).pipe(
                map(response => {
                    return updateFollowContributorSuccess(null)
                }),
                catchError(error => of(updateFollowContributorFailure(error)))
            )));

export default updateFollowContributorListEpic
