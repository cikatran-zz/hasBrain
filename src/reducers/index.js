import { combineReducers } from 'redux'
import nav from './appReducer'
import articlesReducer from './articlesReducer'
import savedReducer from './savedReducer'
import playlistReducer from './playlistReducer'
import onboardingReducer from "./onboardingReducer";

export default combineReducers({
    nav,
    articlesReducer,
    savedReducer,
    playlistReducer,
    onboardingReducer
})
