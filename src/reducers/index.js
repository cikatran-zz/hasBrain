import {combineReducers} from 'redux';
import nav from "./appReducer";
import articlesReducer from "./articlesReducer";

export default combineReducers({
    nav,
    articlesReducer
});