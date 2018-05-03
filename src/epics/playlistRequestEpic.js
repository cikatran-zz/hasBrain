import * as actionTypes from '../actions/actionTypes';
import {getArticleFailure, getArticlesSuccess} from '../actions/getPlaylist';
import {getPlaylist} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getPlaylistEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_PLAYLIST)
        .mergeMap(action =>
            Observable.from(getPlaylist())
                .map(response => getArticlesSuccess(response.data))
                .catch(error => Observable.of(getArticleFailure(error)))
        );

export default getPlaylistEpic;
