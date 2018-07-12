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
import watchingHistoryReducer from "./watchingHistoryReducer";
import categoryReducer from "./categoryReducer";
import feedReducer from "./feedReducer";
import bookmarkedReducer from "./bookmarkedReducer";
import topicListReducer from './topicListReducer';
import contributorListReducer from './contributorListReducer';
import createHighlightReducer from "./createHighlightReducer";
import updateFollowPersonaReducer from "./updateFollowPersonaReducer";
import createUserReducer from "./createUserReducer";
import ownpathReducer from "./ownpathReducer";
import pathCurrentReducer from "./pathCurrentReducer";
import updateUserTopicReducer from "./updateUserTopicReducer";
import updateUserContributorFollowReducer from "./updateUserContributorFollowReducer";
import {SIGN_OUT} from "../actions/actionTypes";
import signOutReducer from "./signOutReducer";
import continueReadingReducer from "./continueReadingReducer";
import articleDetailReducer from "./articleDetailReducer";
import highlightByArticleReducer from "./highlightByArticleReducer"

const myAccountReducer = combineReducers({
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
    watchingHistoryReducer,
    categoryReducer,
    feedReducer,
    bookmarkedReducer,
    topicListReducer,
    contributorListReducer,
    createHighlightReducer,
    createUserReducer,
    updateFollowPersonaReducer,
    ownpathReducer,
    pathCurrentReducer,
    updateUserTopicReducer,
    updateUserContributorFollowReducer,
    signOutReducer,
    continueReadingReducer,
    articleDetailReducer,
    highlightByArticleReducer
});


const rootReducer = (state, action) => {
    if (action.type === SIGN_OUT ) {
        state = undefined
    }
    return myAccountReducer(state, action)
}

export default rootReducer;