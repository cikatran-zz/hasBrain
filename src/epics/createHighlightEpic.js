import * as actionTypes from '../actions/actionTypes';
import {createHighlightSuccess, createHighlightFailure} from '../actions/createHightlight';
import {postHighlightText} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import {trackHighlight} from "../actions/userkitTracking";
import {getUserHighLight} from "../actions/getUserHighLight";

const createHighlightEpic = (action$) =>
    action$.pipe(ofType(actionTypes.CREATING_USER_HIGHLIGHT),
        mergeMap(action =>
            from(postHighlightText(action.data)).pipe(
                map(response => {
                    action.dispatcher(trackHighlight(action.data));
                    action.dispatcher(getUserHighLight(1,10));
                    return createHighlightSuccess();
                }),
                catchError(error => of(createHighlightFailure(error)))
            )));

export default createHighlightEpic;