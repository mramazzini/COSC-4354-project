import { Notification } from "@/types/Models.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
    }),
  }),
});

// export const { useGetNotificationsQuery } = notificationApi;
const useGetNotificationsQuery = () => {
  const testNotifications: Notification[] = [
    {
      id: "1",
      userId: "123",
      message: "Your event has been approved!",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      userId: "123",
      message: "New volunteer opportunity available.",
      read: true,
      createdAt: new Date().toISOString(),
    },
  ];
  return { data: testNotifications, error: null, isLoading: false };
};

export { useGetNotificationsQuery };
