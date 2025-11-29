import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { userApi } from "../services/userApi";
import userReducer from "./userSlice";
import { reportApi } from "../services/reportsApi";
import { matchingApi } from "../services/matchApi";
import { eventApi } from "../services/eventApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [matchingApi.reducerPath]: matchingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(reportApi.middleware)
      .concat(eventApi.middleware)
      .concat(matchingApi.middleware),
});
