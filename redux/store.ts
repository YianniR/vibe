import { configureStore } from '@reduxjs/toolkit';
import websiteReducer from './websiteSlice';
import settingsReducer from './settingsSlice';

const store = configureStore({
  reducer: {
    websites: websiteReducer,
    settings: settingsReducer,
  },
});

export default store;
