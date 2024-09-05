import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER  } from "redux-persist";
import storage from "redux-persist/lib/storage";

import translationCacheReducer from "../features/translation/translationCacheSlice"
import languageReducer from "../features/language/languageSlice"
import translationHistoryReducer from "../features/pdf/translationHistorySlice"

import { combineReducers } from "@reduxjs/toolkit";


const persistConfig = {
    key: "root",
    storage,
    whitelist: ["language","translationCache"],
};

const rootReducer = combineReducers({
    language: languageReducer,
    translationCache: translationCacheReducer,
    translationHistory: translationHistoryReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })},
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
