import * as actionTypes from '../actions/actionTypes';
import {getArticleDetailFailure, getArticleDetailSuccess} from '../actions/getArticleDetail';
import {getArticleDetail} from '../api';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, catchError, map} from 'rxjs/operators';

const articleDetailEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_ARTICLE_DETAIL),
        mergeMap(action =>
            from(getArticleDetail(action.id)).pipe(
                map(response => getArticleDetailSuccess(response.data)),
                catchError(error => of(getArticleDetailFailure(error)))
            )
        ));

export default articleDetailEpic;