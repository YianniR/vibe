import { configureStore } from '@reduxjs/toolkit';
import websiteReducer from './websiteSlice';

const store = configureStore({
  reducer: {
    websites: websiteReducer,
  },
});

export default store;
