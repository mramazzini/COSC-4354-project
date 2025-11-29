import { User } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7292",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "/user",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetMeQuery, useUpdateUserMutation } = userApi;
