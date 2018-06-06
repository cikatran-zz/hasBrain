import {combineEpics} from 'redux-observable';
import getArticlesEpic from "./articlesRequestEpic";

import getSavedEpic from "./savedRequestEpic"
import getPlaylistEpic from "./playlistRequestEpic";
import getOnboardingEpic from "./onboardingRequestEpic";
import getUserHighLightEpic from './userHighLightRequestEpic';
import getUserPathEpic from './userPathRequestEpic';
import {
    getUserProfileEpic,
    updateUserProfileEpic,
    getUserAnalystEpic,
    getUserNameEpic
} from './userProfileEpic'
import getLastReadingPositionEpic from "./lastReadingPositionRequestEpic";

const rootEpic = combineEpics(
    getSavedEpic,
    getArticlesEpic,
    getPlaylistEpic,
    getOnboardingEpic,
    getUserHighLightEpic,
    getUserProfileEpic,
    updateUserProfileEpic,
    getUserAnalystEpic,
    getUserNameEpic,
    getLastReadingPositionEpic,
    getUserPathEpic
);

export default rootEpic;
