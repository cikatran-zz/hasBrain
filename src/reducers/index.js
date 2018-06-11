import { combineReducers } from 'redux'
import nav from './appReducer'
import articlesReducer from './articlesReducer'
import savedReducer from './savedReducer'
import playlistReducer from './playlistReducer'
import onboardingReducer from "./onboardingReducer";
import userHighlightReducer from './userHighlightReducer'
import userProfileReducer from './userProfileReducer';
import userPathReducer from './userPathReducer'
import intentionsReducer from "./intentionsReducer";
import pathRecommendReducer from "./pathRecommendReducer";
import pathBookmarkedReducer from "./pathBookmarkedReducer";

export default combineReducers({
    nav,
    articlesReducer,
    savedReducer,
    playlistReducer,
    onboardingReducer,
    userHighlightReducer,
    userProfileReducer,
    userPathReducer,
    intentionsReducer,
    pathRecommendReducer,
    pathBookmarkedReducer
});
