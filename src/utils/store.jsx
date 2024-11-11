import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // Default storage for web (localStorage)
import authReducer from './authSlice';

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,  // Use localStorage for web
  whitelist: ['auth'],  // Only persist auth-related data (user and token)
};

const persistedReducer = persistReducer(persistConfig, authReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
});

// Create persistor instance to handle persisting and rehydrating state
export const persistor = persistStore(store);

export default store;
