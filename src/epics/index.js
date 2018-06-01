import {combineEpics} from 'redux-observable';
import getArticlesEpic from "./articlesRequestEpic";

import getSavedEpic from "./savedRequestEpic"
import getPlaylistEpic from "./playlistRequestEpic";
import getOnboardingEpic from "./onboardingRequestEpic";
import getLastReadingPositionEpic from "./lastReadingPositionRequestEpic";

const rootEpic = combineEpics(
    getSavedEpic,
    getArticlesEpic,
    getPlaylistEpic,
    getOnboardingEpic,
    getLastReadingPositionEpic
);

export default rootEpic;
