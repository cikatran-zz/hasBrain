import * as actionTypes from '../actions/actionTypes';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {getNotification} from "../api";
import {getNotificationFailure, getNotificationSuccess} from "../actions/getNotification";

const getNotificationEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_NOTIFICATION)
        .mergeMap(action =>
            Observable.from(getNotification())
                .map(response => getNotificationSuccess(response.result))
                .catch(error => Observable.of(getNotificationFailure(error)))
        );

export default getNotificationEpic;
