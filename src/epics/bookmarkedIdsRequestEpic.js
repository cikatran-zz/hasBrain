import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import { Observable } from 'rxjs/Observable'
import { getBookmarkedIds } from '../api'
import { getBookmarkedIdsFailure, getBookmarkedIdsSuccess } from '../actions/getBookmarkedIds'
import {strings} from "../constants/strings";

const getBookmarkedIdsEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_BOOKMARKEDIDS)
        .mergeMap(action =>
            Observable.from(getBookmarkedIds(1, 1000))
                .map(response => getBookmarkedIdsSuccess(response.data))
                .catch(error => Observable.of(getBookmarkedIdsFailure(error)))
        );

export default getBookmarkedIdsEpic
