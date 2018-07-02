import * as actionTypes from '../actions/actionTypes'
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of, forkJoin} from 'rxjs';
import { ofType } from 'redux-observable';
import { getUserKitProfile, getUserFollow } from '../api'
import { getContributorListSuccess, getContributorListFailure } from '../actions/getContributorList'

const getContributorListEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_CONTRIBUTOR_LIST),
        mergeMap(action =>
            forkJoin([getUserKitProfile(), getUserFollow("contributortype")]).pipe(
                map(response => {
                    return getContributorListSuccess(response)
                }),
                catchError(error => of(getContributorListFailure(error)))
            )));

export default getContributorListEpic
