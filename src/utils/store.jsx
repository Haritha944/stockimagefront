import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // Default storage for web (localStorage)
import authReducer from './authSlice';


const persistConfig = {
  key: 'root',
  storage,  
  whitelist: ['auth'],  
};

const persistedReducer = persistReducer(persistConfig, authReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['_persist'],
      },
    }),
});


export const persistor = persistStore(store);

export default store;
