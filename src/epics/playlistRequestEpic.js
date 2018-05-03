import * as actionTypes from '../actions/actionTypes';
import {getPlaylistFailure, getPlaylistsSuccess} from '../actions/getPlaylists';
import {getPlaylists} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getPlaylistEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_PLAYLIST)
        .mergeMap(action =>
            Observable.from(getPlaylists())
                .map(response => getPlaylistsSuccess(response.data))
                .catch(error => Observable.of(getPlaylistFailure(error)))
        );

export default getPlaylistEpic;