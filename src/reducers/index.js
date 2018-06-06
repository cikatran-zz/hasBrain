import { combineReducers } from 'redux'
import nav from './appReducer'
import articlesReducer from './articlesReducer'
import savedReducer from './savedReducer'
import playlistReducer from './playlistReducer'
import onboardingReducer from "./onboardingReducer";
import userHighlightReducer from './userHighlightReducer'
import userProfileReducer from './userProfileReducer';
import userPathReducer from './userPathReducer'

export default combineReducers({
    nav,
    articlesReducer,
    savedReducer,
    playlistReducer,
    onboardingReducer,
    userHighlightReducer,
    userProfileReducer,
    userPathReducer
});
