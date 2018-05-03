import {combineEpics} from 'redux-observable';
import getArticlesEpic from "./articlesRequestEpic";

import getNotificationEpic from "./notificationRequestEpic"

const rootEpic = combineEpics(
    getNotificationEpic,
    getArticlesEpic
);

export default rootEpic;
