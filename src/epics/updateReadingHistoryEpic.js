import * as actionTypes from '../actions/actionTypes';
import {updateReadingHistoryFailure, updateReadingHistorySuccess} from '../actions/updateReadingHistory';
import {getContinueReading} from "../actions/getContinueReading";
import {updateReadingHistory} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';

const updateReadingHistoryEpic = (action$) =>
    action$.pipe(ofType(actionTypes.UPDATING_READING_HISTORY),
        mergeMap(action =>
            from(updateReadingHistory(action.articleId, action.scrollOffset)).pipe(
                map(response => {
                    action.dispatcher(getContinueReading());
                    return updateReadingHistorySuccess();
                }),
                catchError(error => of(updateReadingHistoryFailure(error)))
            )));

export default updateReadingHistoryEpic;