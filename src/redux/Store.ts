import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appReducer';

const Store = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    }),
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
