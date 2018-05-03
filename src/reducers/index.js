import {combineReducers} from 'redux';
import nav from "./appReducer";
import articlesReducer from "./articlesReducer";
import notificationReducer from "./notificationReducer";
import playlistReducer from "./playlistReducer";

export default combineReducers({
    nav,
    articlesReducer,
    notificationReducer
    playlistReducer
});
