import * as actionTypes from '../actions/actionTypes';
import {getArticleFailure, getArticlesSuccess} from '../actions/getArticles';
import {getExploreArticles} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getArticlesEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_ARTICLE)
        .mergeMap(action =>
            Observable.from(getExploreArticles(action.limit, action.skip, action.sources, action.tags))
                .map(response => getArticlesSuccess(response.data, action.skip))
                .catch(error => Observable.of(getArticleFailure(error)))
        );

export default getArticlesEpic;