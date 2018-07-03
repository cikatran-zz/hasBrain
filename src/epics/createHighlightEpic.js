import * as actionTypes from '../actions/actionTypes';
import {createHighlightSuccess, createHighlightFailure} from '../actions/createHightlight';
import {postHighlightText} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';

const createHighlightEpic = (action$) =>
    action$.pipe(ofType(actionTypes.CREATING_USER_HIGHLIGHT),
        mergeMap(action =>
            from(postHighlightText(action.articleId, action.highlight, action.position, action.comment, action.note)).pipe(
                map(response => createHighlightSuccess(action.articleId, action.highlight, action.position, action.comment, action.note)),
                catchError(error => of(createHighlightFailure(error)))
            )));

export default createHighlightEpic;