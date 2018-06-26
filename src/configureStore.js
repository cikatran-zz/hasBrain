import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import app from './reducers';
import devTools from 'remote-redux-devtools';

import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epics';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage'


const epicMiddleware = createEpicMiddleware();
let applyMiddlewares = applyMiddleware(epicMiddleware);

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['articlesReducer', 'playlistReducer', 'savedReducer', 'sourcelistReducer', 'userPathReducer', 'pathBookmarkedReducer', 'pathRecommendReducer'],
    stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, app);

if (__DEV__) {
    const logger = createLogger({ collapsed: true });
    applyMiddlewares = applyMiddleware(epicMiddleware, logger);
}

const enhancer = compose(
    applyMiddlewares,
    devTools(),
);


export default () => {
    let store = createStore(persistedReducer, enhancer);
    epicMiddleware.run(rootEpic)
    let persistor = persistStore(store);
    return {store, persistor}
};