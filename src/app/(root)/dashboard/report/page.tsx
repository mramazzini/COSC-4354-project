"use client";

import {
  useGetVolunteerReportMutation,
  useGetEventReportMutation,
} from "@/lib/services/reportsApi";
import { ReportFormat } from "@/types/Reports.types";
import { useState, useCallback } from "react";

const ReportsPage = () => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [format, setFormat] = useState<ReportFormat>("csv");

  const [getVolunteerReport, volunteerState] = useGetVolunteerReportMutation();
  const [getEventReport, eventState] = useGetEventReportMutation();

  const isBusy = volunteerState.isLoading || eventState.isLoading;

  const buildRange = useCallback(() => {
    const fromUtc = fromDate
      ? new Date(`${fromDate}T00:00:00`).toISOString()
      : undefined;
    const toUtc = toDate
      ? new Date(`${toDate}T23:59:59`).toISOString()
      : undefined;
    return { fromUtc, toUtc };
  }, [fromDate, toDate]);

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleVolunteerReport = useCallback(async () => {
    try {
      const { fromUtc, toUtc } = buildRange();
      const res = await getVolunteerReport({
        fromUtc,
        toUtc,
        format,
      }).unwrap();

      triggerDownload(res.blob, res.filename);
    } catch (err) {
      console.error("Failed to generate volunteer report", err);
    }
  }, [buildRange, getVolunteerReport, format]);

  const handleEventReport = useCallback(async () => {
    try {
      const { fromUtc, toUtc } = buildRange();
      const res = await getEventReport({
        fromUtc,
        toUtc,
        format,
      }).unwrap();

      triggerDownload(res.blob, res.filename);
    } catch (err) {
      console.error("Failed to generate event report", err);
    }
  }, [buildRange, getEventReport, format]);

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-base-content/70">
            Generate CSV or PDF exports for volunteer activity and event
            participation.
          </p>
        </div>

        {isBusy && (
          <span className="text-xs italic text-base-content/70">
            Generating report…
          </span>
        )}
      </header>

      {/* Shared Filters */}
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <h2 className="card-title text-base">Filters</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="fromDate">
                From date
              </label>
              <input
                id="fromDate"
                type="date"
                className="input input-bordered input-sm"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <span className="text-[0.7rem] text-base-content/60">
                Optional. Leave blank for earliest.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="toDate">
                To date
              </label>
              <input
                id="toDate"
                type="date"
                className="input input-bordered input-sm"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <span className="text-[0.7rem] text-base-content/60">
                Optional. Leave blank for latest.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="format">
                Format
              </label>
              <select
                id="format"
                className="select select-bordered select-sm"
                value={format}
                onChange={(e) => setFormat(e.target.value as ReportFormat)}
              >
                <option value="csv">CSV (spreadsheet friendly)</option>
                <option value="pdf">PDF (print/share ready)</option>
              </select>
              <span className="text-[0.7rem] text-base-content/60">
                Applies to both report types.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Actions */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* Volunteer Report */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <h2 className="card-title text-base">Volunteer Activity Report</h2>
            <p className="text-sm text-base-content/80">
              Exports volunteers, their participation history, total hours, and
              events they attended within the selected date range.
            </p>

            {volunteerState.isError && (
              <div className="alert alert-error py-2 text-xs">
                <span>Could not generate volunteer report.</span>
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary btn-sm self-start"
              onClick={handleVolunteerReport}
              disabled={volunteerState.isLoading || eventState.isLoading}
            >
              {volunteerState.isLoading
                ? "Generating…"
                : "Download Volunteer Report"}
            </button>

            <div className="text-[0.7rem] text-base-content/60">
              <ul className="list-disc list-inside space-y-1">
                <li>Volunteer name &amp; email</li>
                <li>Total events &amp; total minutes served</li>
                <li>Per-event breakdown (date, location, duration)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Event Report */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <h2 className="card-title text-base">Event Participation Report</h2>
            <p className="text-sm text-base-content/80">
              Exports events, their details, and which volunteers participated
              (including total hours per event) within the selected date range.
            </p>

            {eventState.isError && (
              <div className="alert alert-error py-2 text-xs">
                <span>Could not generate event report.</span>
              </div>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-sm self-start"
              onClick={handleEventReport}
              disabled={volunteerState.isLoading || eventState.isLoading}
            >
              {eventState.isLoading ? "Generating…" : "Download Event Report"}
            </button>

            <div className="text-[0.7rem] text-base-content/60">
              <ul className="list-disc list-inside space-y-1">
                <li>Event name, date, location, urgency</li>
                <li>Required skills &amp; assigned volunteers</li>
                <li>Total volunteer hours per event</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportsPage;
