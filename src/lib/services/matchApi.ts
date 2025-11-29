import { EventItem, Volunteer } from "@/types/Match.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const matchingApi = createApi({
  reducerPath: "matchingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7292",
    credentials: "include",
  }),
  tagTypes: ["Volunteer", "Event"],
  endpoints: (builder) => ({
    getMatchingVolunteers: builder.query<Volunteer[], void>({
      query: () => "matching/volunteers",
      providesTags: (result) =>
        result
          ? [
              ...result.map((v) => ({ type: "Volunteer" as const, id: v.id })),
              { type: "Volunteer" as const, id: "LIST" },
            ]
          : [{ type: "Volunteer" as const, id: "LIST" }],
    }),
    getMatchingEvents: builder.query<EventItem[], void>({
      query: () => "matching/events",
      providesTags: (result) =>
        result
          ? [
              ...result.map((e) => ({ type: "Event" as const, id: e.id })),
              { type: "Event" as const, id: "LIST" },
            ]
          : [{ type: "Event" as const, id: "LIST" }],
    }),
  }),
});

export const { useGetMatchingVolunteersQuery, useGetMatchingEventsQuery } =
  matchingApi;
