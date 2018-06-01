import * as actionTypes from './actionTypes';

export function getPlaylist(page, perPage) {
    return {
        type: actionTypes.FETCHING_PLAYLIST,
    }
}

export function getPlaylistSuccess(data) {
    return {
        type: actionTypes.FETCH_PLAYLIST_SUCCESS,
        data: data.viewer.listOne.contentData,
        title: data.viewer.listOne.title
    }
}


export function getPlaylistFailure(error) {
    return {
        type: actionTypes.FETCH_PLAYLIST_FAILURE,
        errorMessage: error
    }
}
