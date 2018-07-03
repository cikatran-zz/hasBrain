import { combineReducers } from 'redux'
import articlesReducer from './articlesReducer'
import savedReducer from './savedReducer'
import playlistReducer from './playlistReducer'
import onboardingReducer from "./onboardingReducer";
import userHighlightReducer from './userHighlightReducer'
import userProfileReducer from './userProfileReducer';
import userPathReducer from './userPathReducer';
import sourcelistReducer from './sourcelistReducer';
import intentionsReducer from "./intentionsReducer";
import pathRecommendReducer from "./pathRecommendReducer";
import pathBookmarkedReducer from "./pathBookmarkedReducer";
import updateRecommendSourceReducer from "./updateRecommendSourceReducer";
import allIntentionsReducer from "./allIntentionsReducer";
import createBookmarkReducer from "./createBookmarkReducer";
import removeBookmarkReducer from "./removeBookmarkReducer";
import watchingHistoryReducer from "./watchingHistoryReducer";
import categoryReducer from "./categoryReducer";
import feedReducer from "./feedReducer";
import bookmarkedIdsReducer from "./bookmarkedIdsReducer";
import topicListReducer from './topicListReducer';
import contributorListReducer from './contributorListReducer';
import createHighlightReducer from "./createHighlightReducer";
import updateFollowPersonaReducer from "./updateFollowPersonaReducer";
import createUserReducer from "./createUserReducer";
import ownpathReducer from "./ownpathReducer";
import pathCurrentReducer from "./pathCurrentReducer";

export default combineReducers({
    articlesReducer,
    savedReducer,
    playlistReducer,
    onboardingReducer,
    userHighlightReducer,
    userProfileReducer,
    userPathReducer,
    sourcelistReducer,
    intentionsReducer,
    allIntentionsReducer,
    pathRecommendReducer,
    pathBookmarkedReducer,
    updateRecommendSourceReducer,
    createBookmarkReducer,
    removeBookmarkReducer,
    watchingHistoryReducer,
    categoryReducer,
    feedReducer,
    bookmarkedIdsReducer,
    topicListReducer,
    contributorListReducer,
    createHighlightReducer,
    createUserReducer,
    updateFollowPersonaReducer,
    ownpathReducer,
    pathCurrentReducer
});
