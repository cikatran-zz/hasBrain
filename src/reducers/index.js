import { combineReducers } from 'redux'
import nav from './appReducer'
import articlesReducer from './articlesReducer'
import notificationReducer from './notificationReducer'
import savedReducer from './savedReducer'
import playlistReducer from './playlistReducer'

export default combineReducers({
    nav,
    articlesReducer,
    notificationReducer,
    savedReducer,
    playlistReducer
})
