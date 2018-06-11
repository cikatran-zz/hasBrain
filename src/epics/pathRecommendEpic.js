import * as actionTypes from '../actions/actionTypes';
import {getPathRecommendFailure, getPathRecommendSuccess} from '../actions/getPathRecommend';
import {getPathRecommend} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getPathRecommendEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_PATH_RECOMMEND)
        .mergeMap(action =>
            Observable.from(getPathRecommend(action.page, action.perPage))
                .map(response => getPathRecommendSuccess(response.data, action.page))
                .catch(error => Observable.of(getPathRecommendFailure(error)))
        );

export default getPathRecommendEpic;