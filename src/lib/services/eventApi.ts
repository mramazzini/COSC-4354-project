import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AssignVolunteerRequest,
  AssignVolunteerResponse,
} from "@/types/Volunteer.types";
import { Event, EventUrgency, Notification } from "@prisma/client";

export type EventWithTime = Event & { timeAtEvent: string };

export type UpcomingEvent = Event & {
  spots?: number;
  isRemote?: boolean;
};

export interface CreateEventRequest {
  name: string;
  description: string;
  location: string;
  dateUtc: string;
  urgency: EventUrgency | string;
  requiredSkills: string[];
}

export interface UpsertEventRequest extends CreateEventRequest {
  id?: string;
}

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7292",
    credentials: "include",
  }),
  tagTypes: ["UpcomingEvents", "Notifications", "EventAssignments"],
  endpoints: (builder) => ({
    getUpcomingEvents: builder.query<UpcomingEvent[], void>({
      query: () => ({
        url: "/events/upcoming",
        method: "GET",
      }),
      providesTags: (result) =>
        result && result.length
          ? [
              ...result.map((e) => ({
                type: "UpcomingEvents" as const,
                id: e.id,
              })),
              { type: "UpcomingEvents" as const, id: "LIST" },
            ]
          : [{ type: "UpcomingEvents" as const, id: "LIST" }],
    }),

    getVolunteerHistory: builder.query<EventWithTime[], void>({
      query: () => ({
        url: "/events/history",
        method: "GET",
      }),
    }),

    updateEvent: builder.mutation<UpcomingEvent, UpsertEventRequest>({
      query: ({ id, ...body }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: { id, ...body },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "UpcomingEvents", id: arg.id },
        { type: "UpcomingEvents", id: "LIST" },
      ],
    }),

    assignVolunteerToEvent: builder.mutation<
      AssignVolunteerResponse,
      { eventId: string; body: AssignVolunteerRequest }
    >({
      query: ({ eventId, body }) => ({
        url: `/events/${eventId}/assign-volunteer`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "UpcomingEvents", id: arg.eventId },
        { type: "UpcomingEvents", id: "LIST" },
        { type: "Notifications", id: "LIST" },
        { type: "EventAssignments", id: arg.eventId },
      ],
    }),

    getEventAssignments: builder.query<string[], string>({
      query: (eventId) => ({
        url: `/events/${eventId}/assignments`,
        method: "GET",
      }),
      providesTags: (_result, _error, eventId) => [
        { type: "EventAssignments", id: eventId },
      ],
    }),

    getNotifications: builder.query<Notification[], void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: (result) =>
        result && result.length
          ? [
              ...result.map((n) => ({
                type: "Notifications" as const,
                id: n.id,
              })),
              { type: "Notifications" as const, id: "LIST" },
            ]
          : [{ type: "Notifications" as const, id: "LIST" }],
    }),

    markAllNotificationsRead: builder.mutation<{ updated: number }, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUpcomingEventsQuery,
  useGetVolunteerHistoryQuery,
  useUpdateEventMutation,
  useAssignVolunteerToEventMutation,
  useGetEventAssignmentsQuery,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} = eventApi;
