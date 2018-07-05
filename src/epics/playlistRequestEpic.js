import * as actionTypes from '../actions/actionTypes';
import {getPlaylistFailure, getPlaylistSuccess} from '../actions/getPlaylist';
import {getPlaylist} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';

const getPlaylistEpic = (action$) =>
    action$.pipe(ofType(actionTypes.FETCHING_PLAYLIST),
        mergeMap(action =>
            from(getPlaylist()).pipe(
                map(response => getPlaylistSuccess(response.data)),
                catchError(error => of(getPlaylistFailure(error)))
            )));

export default getPlaylistEpic;
