import * as actionTypes from '../actions/actionTypes';
import {getArticleFailure, getArticlesSuccess} from '../actions/getArticles';
import {getArticles} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getArticlesEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_ARTICLE)
        .mergeMap(action =>
            Observable.from(getArticles(action.page, action.perPage))
                .map(response => getArticlesSuccess(response.data, action.page))
                .catch(error => Observable.of(getArticleFailure(error)))
        );

export default getArticlesEpic;