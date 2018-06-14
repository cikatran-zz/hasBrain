import { combineReducers } from 'redux'
import nav from './appReducer'
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

export default combineReducers({
    nav,
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
    createBookmarkReducer
});
