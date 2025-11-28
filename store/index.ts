import { configureStore } from '@reduxjs/toolkit';
import shoppingReducer from './slices/shoppingSlice';

export const store = configureStore({
  reducer: {
    shopping: shoppingReducer,
  },
});
