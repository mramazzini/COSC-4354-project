import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { userApi } from "../services/userApi";
import userReducer from "./userSlice";
import { notificationApi } from "../services/notificationApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(notificationApi.middleware),
});
