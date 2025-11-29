import { ReportDownload, ReportRequestParams } from "@/types/Reports.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7292",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getVolunteerReport: builder.mutation<ReportDownload, ReportRequestParams>({
      query: ({ fromUtc, toUtc, format = "csv" }) => ({
        url: "reports/volunteers",
        method: "GET",
        params: {
          fromUtc,
          toUtc,
          format,
        },
        // Turn Response → { blob, filename, contentType }
        responseHandler: async (response) => {
          const blob = await response.blob();
          const contentType = blob.type || "application/octet-stream";

          const disposition = response.headers.get("content-disposition") ?? "";
          // naive parse: filename="something.ext"
          const match = /filename="?([^"]+)"?/i.exec(disposition);
          const filename =
            match?.[1] ??
            `volunteer-activity-${new Date().toISOString()}.${format}`;

          const result: ReportDownload = {
            blob,
            filename,
            contentType,
          };
          return result;
        },
      }),
    }),

    getEventReport: builder.mutation<ReportDownload, ReportRequestParams>({
      query: ({ fromUtc, toUtc, format = "csv" }) => ({
        url: "reports/events",
        method: "GET",
        params: {
          fromUtc,
          toUtc,
          format,
        },
        responseHandler: async (response) => {
          const blob = await response.blob();
          const contentType = blob.type || "application/octet-stream";

          const disposition = response.headers.get("content-disposition") ?? "";
          const match = /filename="?([^"]+)"?/i.exec(disposition);
          const filename =
            match?.[1] ??
            `event-participation-${new Date().toISOString()}.${format}`;

          const result: ReportDownload = {
            blob,
            filename,
            contentType,
          };
          return result;
        },
      }),
    }),
  }),
});

export const { useGetVolunteerReportMutation, useGetEventReportMutation } =
  reportApi;
