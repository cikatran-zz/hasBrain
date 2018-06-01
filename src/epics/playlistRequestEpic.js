import * as actionTypes from '../actions/actionTypes';
import {getPlaylistFailure, getPlaylistSuccess} from '../actions/getPlaylist';
import {getPlaylist} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getPlaylistEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_PLAYLIST)
        .mergeMap(action =>
            Observable.from(getPlaylist())
                .map(response => getPlaylistSuccess(response.data))
                .catch(error => Observable.of(getPlaylistFailure(error)))
        );

export default getPlaylistEpic;
