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
    getUserNameEpic,
    getAvatarEpic
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
import getFeedEpic from "./feedRequestEpic";
import getBookmarkedIdsEpic from "./bookmarkedIdsRequestEpic";
import getTopicListEpic from './getTopicRequestEpic'
import updateTopicListEpic from './updateTopicEpic'
import createHighlightEpic from "./createHighlightEpic";
import getContributorListEpic from './getContributorRequestEpic'
import updateFollowContributorEpic from './updateFollowContributorEpic'
import createUserEpic from "./createUserEpic";
import updateFollowPersonaEpic from "./updateFollowPersonaEpic";
import ownpathRequestEpic from "./ownpathRequestEpic";
import getPathCurrentEpic from './currentPathEpicRequest'
import continueReadingRequestEpic from "./continueReadingRequestEpic";
import articleDetailEpic from "./articleDetailRequestEpic";
import updateReadingHistoryEpic from "./updateReadingHistoryEpic";
import articleDetailByUrlEpic from "./articleDetailByUrlRequestEpic";
import highlightByArticleEpic from "./highlightByArticleRequestEpic";
import removeHighlightEpic from "./removeHighlightEpic";

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
    getCategoryEpic,
    getFeedEpic,
    getBookmarkedIdsEpic,
    getTopicListEpic,
    updateTopicListEpic,
    getContributorListEpic,
    updateFollowContributorEpic,
    createHighlightEpic,
    createUserEpic,
    updateFollowPersonaEpic,
    ownpathRequestEpic,
    getPathCurrentEpic,
    continueReadingRequestEpic,
    articleDetailEpic,
    updateReadingHistoryEpic,
    articleDetailByUrlEpic,
    highlightByArticleEpic,
    removeHighlightEpic,
    getAvatarEpic
);

export default rootEpic;
