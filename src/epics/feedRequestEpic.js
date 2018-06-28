import * as actionTypes from '../actions/actionTypes';
import {getFeedFailure, getFeedSuccess} from '../actions/getFeed';
import {getFeed} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getFeedEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_FEED)
        .mergeMap(action =>
            Observable.from(getFeed(action.page, action.perPage))
                .map(response => getFeedSuccess(response.data, action.skip))
                .catch(error => Observable.of(getFeedFailure(error)))
        );

export default getFeedEpic;