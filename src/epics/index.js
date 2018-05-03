import {combineEpics} from 'redux-observable';
import getArticlesEpic from "./articlesRequestEpic";

import getNotificationEpic from "./notificationRequestEpic"
import getSavedEpic from "./savedRequestEpic"
import getPlaylistEpic from "./playlistRequestEpic";

const rootEpic = combineEpics(
    getNotificationEpic,
    getSavedEpic,
    getArticlesEpic,
    getPlaylistEpic
);

export default rootEpic;
