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
import getIntentsEpic from "./intentRequestEpic";
import getPathRecommendEpic from "./pathRecommendEpic";
import getPathBookmarkedEpic from "./pathBookmarkedEpic";
import updateRecommendSourceEpic from "./updateRecommendSourceEpic";
import getSourceListEpic from './sourcelistRequestEpic';
import updateSourceListEpic from './updateSourceListEpic'
import getAllIntentsEpic from "./allIntentRequestEpic";
import createBookmarkEpic from "./createBookmarkEpic";
import removeBookmarkEpic from "./removeBookmarkEpic";
import getWatchingHistoryEpic from "./watchingHistoryRequestEpic";
import getCategoryEpic from "./categoryRequestEpic";

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
    getUserPathEpic,
    getIntentsEpic,
    getAllIntentsEpic,
    getPathRecommendEpic,
    getPathBookmarkedEpic,
    updateRecommendSourceEpic,
    getSourceListEpic,
    updateSourceListEpic,
    createBookmarkEpic,
    removeBookmarkEpic,
    getWatchingHistoryEpic,
    getCategoryEpic
);

export default rootEpic;
