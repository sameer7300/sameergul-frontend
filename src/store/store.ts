import { configureStore } from '@reduxjs/toolkit';
import { hiringApi } from '../services/hiringApi';
import { adminApi } from '../services/adminApiSlice';
import { userApi } from '../services/userApi';

export const store = configureStore({
  reducer: {
    [hiringApi.reducerPath]: hiringApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      hiringApi.middleware,
      adminApi.middleware,
      userApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
