import * as actionTypes from '../actions/actionTypes';
import {removeHighlightFailure, removeHighlightSuccess} from '../actions/removeHighlight';
import {postRemoveHighlightByArticle} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import {getHighlightByArticle} from "../actions/getHighlightByArticle";

const removeHighlightEpic = (action$) =>
    action$.pipe(ofType(actionTypes.REMOVING_HIGHLIGHT),
        mergeMap(action =>
            from(postRemoveHighlightByArticle(action.articleId, action.highlightId)).pipe(
                map(response => {
                    action.dispatcher(getHighlightByArticle(action.articleId));
                    return removeHighlightSuccess(action.articleId)
                }),
                catchError(error => of(removeHighlightFailure(error)))
            )));

export default removeHighlightEpic;