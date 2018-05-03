import {combineReducers} from 'redux';
import nav from "./appReducer";
import articlesReducer from "./articlesReducer";
import notificationReducer from "./notificationReducer";

export default combineReducers({
    nav,
    articlesReducer,
    notificationReducer
});
