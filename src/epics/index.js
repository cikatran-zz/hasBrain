import {combineEpics} from 'redux-observable';
import getArticlesEpic from "./articlesRequestEpic";

import getNotificationEpic from "./notificationRequestEpic"
import getPlaylistEpic from "./playlistRequestEpic";

const rootEpic = combineEpics(
    getNotificationEpic,
    getArticlesEpic,
    getPlaylistEpic
);

export default rootEpic;
