import * as actionTypes from '../actions/actionTypes';
import {getHighlightByArticleFailure, getHighlightByArticleSuccess} from '../actions/getHighlightByArticle';
import {getHighlightByArticle} from '../api';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, catchError, map} from 'rxjs/operators';

const highlightByArticleEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_HIGHLIGHT_ARTICLE),
        mergeMap(action =>
            from(getHighlightByArticle(action.id)).pipe(
                map(response => getHighlightByArticleSuccess(response.data)),
                catchError(error => of(getHighlightByArticleFailure(error)))
            )
        ));

export default highlightByArticleEpic;