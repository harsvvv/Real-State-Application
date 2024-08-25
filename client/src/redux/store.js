/* eslint-disable no-unused-vars */
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'

// Combine your reducers
const rootReducer = combineReducers({ user: userReducer });

// Configure the store without persistence
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;