import * as actionTypes from '../actions/actionTypes';
import {getArticleDetailFailure, getArticleDetailByUrlSuccess} from '../actions/getArticleDetail';
import {getArticleDetailByUrl} from '../api';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, catchError, map} from 'rxjs/operators';

const articleDetailByUrlEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_ARTICLE_DETAIL_BY_URL),
        mergeMap(action =>
            from(getArticleDetailByUrl(action.url)).pipe(
                map(response => {
                   return getArticleDetailByUrlSuccess(response.data)
                }),
                catchError(error => of(getArticleDetailFailure(error)))
            )
        ));

export default articleDetailByUrlEpic;