import * as actionTypes from './actionTypes';

export function getPlaylist(page, perPage) {
    return {
        type: actionTypes.FETCHING_PLAYLIST,
    }
}

export function getArticlesSuccess(data) {
    return {
        type: actionTypes.FETCH_PLAYLIST_SUCCESS,
        data: data.viewer.playlistOne.mediaData
    }
}


export function getArticleFailure(error) {
    return {
        type: actionTypes.FETCH_PLAYLIST_FAILURE,
        errorMessage: error
    }
}
