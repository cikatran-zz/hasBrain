import * as actionTypes from '../actions/actionTypes';
import {getArticleFailure, getArticlesSuccess} from '../actions/getArticles';
import {getExploreArticles} from '../api';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, catchError, map} from 'rxjs/operators';

const getArticlesEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_ARTICLE),
        mergeMap(action =>
            from(getExploreArticles(action.limit, action.skip, action.sources, action.tags)).pipe(
                map(response => getArticlesSuccess(response.data, action.skip)),
                catchError(error => of(getArticleFailure(error)))
            )
        ));

export default getArticlesEpic;