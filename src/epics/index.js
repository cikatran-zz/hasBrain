import {combineEpics} from 'redux-observable';

import getNotificationEpic from "./notificationRequestEpic"

const rootEpic = combineEpics(
    getNotificationEpic
);

export default rootEpic;
