"use client";

import { AdminGuard } from "@/components/Auth/AdminGuard";
import { VolunteerSkillLabel } from "@/components/UI/VolunteerSkillLabel";
import {
  useAssignVolunteerToEventMutation,
  useGetEventAssignmentsQuery,
} from "@/lib/services/eventApi";
import {
  useGetMatchingVolunteersQuery,
  useGetMatchingEventsQuery,
} from "@/lib/services/matchApi";
import { Volunteer, EventItem } from "@/types/Match.types";
import { EventUrgency } from "@prisma/client";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useState } from "react";

const urgencyBadge = (u: EventUrgency) =>
  u === "High"
    ? "badge-error"
    : u === "Medium"
    ? "badge-warning"
    : "badge-success";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function computeMatch(vol: Volunteer, evts: EventItem[]) {
  const scoreFor = (e: EventItem) => {
    const overlap = e.requiredSkills.filter((s) =>
      vol.skills.includes(s)
    ).length;
    const total = e.requiredSkills.length || 1;
    return overlap / total;
  };
  const ranked = [...evts].sort((a, b) => scoreFor(b) - scoreFor(a));
  const best = ranked[0];

  const overlappingSkills = best.requiredSkills.filter((s) =>
    vol.skills.includes(s)
  );
  const missingSkills = best.requiredSkills.filter(
    (s) => !vol.skills.includes(s)
  );
  const extraSkills = vol.skills.filter(
    (s) => !best.requiredSkills.includes(s)
  );
  const score = Math.round(
    (overlappingSkills.length / best.requiredSkills.length) * 100
  );

  return { best, score, overlappingSkills, missingSkills, extraSkills };
}

const VolunteerMatchingPage = () => {
  const {
    data: volunteers = [],
    isLoading: volunteersLoading,
    isError: volunteersError,
  } = useGetMatchingVolunteersQuery();

  const {
    data: events = [],
    isLoading: eventsLoading,
    isError: eventsError,
  } = useGetMatchingEventsQuery();

  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!selectedVolunteerId && volunteers.length > 0) {
      setSelectedVolunteerId(volunteers[0].id);
    }
  }, [selectedVolunteerId, volunteers]);

  const volunteer = useMemo(
    () =>
      selectedVolunteerId
        ? volunteers.find((v) => v.id === selectedVolunteerId) ?? null
        : null,
    [selectedVolunteerId, volunteers]
  );

  const match = useMemo(() => {
    if (!volunteer || events.length === 0) return null;
    return computeMatch(volunteer, events);
  }, [volunteer, events]);

  const loading = volunteersLoading || eventsLoading;
  const hasError = volunteersError || eventsError;

  const [assignVolunteer, { isLoading }] = useAssignVolunteerToEventMutation();

  const { data: assignedVolunteerIds = [] } = useGetEventAssignmentsQuery(
    match ? match.best.id : skipToken
  );

  const alreadyAssigned =
    !!volunteer && assignedVolunteerIds.includes(volunteer.id);

  const handleAssign = async () => {
    await assignVolunteer({
      eventId: match!.best.id,
      body: {
        volunteerId: volunteer!.id,
        durationMinutes: 90,
      },
    }).unwrap();
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="skeleton h-8 w-48 mb-4" />
        <div className="skeleton h-40 w-full" />
      </div>
    );
  }

  if (hasError || !volunteer || !match) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">Volunteer Matching</h1>
        <p className="text-sm text-error">
          Unable to load volunteers or events for matching.
        </p>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Volunteer Matching</h1>
            <p className="italic text-base-content/80">
              Select a volunteer to auto-fill a recommended event based on
              skills.
            </p>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Suggested Match</div>
              <div className="stat-value text-primary">{match.score}%</div>
              <div className="stat-desc">skills alignment</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 card-border border-base-300">
          <div className="card-body gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="form-control">
                <label className="label" htmlFor="volunteer">
                  <span className="label-text font-semibold">
                    Volunteer Name
                  </span>
                  <span className="badge badge-outline">Auto-filled</span>
                </label>
                <select
                  id="volunteer"
                  className="select select-bordered"
                  value={selectedVolunteerId ?? ""}
                  onChange={(e) => setSelectedVolunteerId(e.target.value)}
                >
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-base-content/70">
                  Loaded from volunteers database.
                </p>
              </div>

              <div className="form-control">
                <label className="label" htmlFor="event">
                  <span className="label-text font-semibold">
                    Matched Event
                  </span>
                  <span className="badge badge-primary">Auto-matched</span>
                </label>
                <select
                  id="event"
                  className="select select-bordered"
                  value={match.best.id}
                  disabled
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} — {fmtDate(e.date)}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-base-content/70">
                  Best match based on skills overlap (visual only).
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <h2 className="card-title">{volunteer.name}</h2>
                    <span className="flex gap-2">
                      <span className="badge">Volunteer</span>
                      {alreadyAssigned && (
                        <span className="badge badge-success">
                          Assigned to this event
                        </span>
                      )}
                    </span>
                  </div>

                  {volunteer.availability && (
                    <Detail
                      label="Availability"
                      value={volunteer.availability}
                    />
                  )}
                  {volunteer.interests?.length ? (
                    <Detail
                      label="Interests"
                      value={
                        <div className="flex flex-wrap gap-2">
                          {volunteer.interests.map((i) => (
                            <span key={i} className="badge badge-outline">
                              {i}
                            </span>
                          ))}
                        </div>
                      }
                    />
                  ) : null}
                  <Detail
                    label="Skills"
                    value={
                      <div className="flex flex-wrap gap-2">
                        {volunteer.skills.map((s) => (
                          <VolunteerSkillLabel
                            key={s}
                            value={s}
                            className="badge badge-neutral badge-outline"
                          ></VolunteerSkillLabel>
                        ))}
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <h2 className="card-title">{match.best.name}</h2>
                    <span
                      className={`badge ${urgencyBadge(match.best.urgency)}`}
                    >
                      {match.best.urgency}
                    </span>
                  </div>
                  <p className="text-base-content/80">
                    {match.best.description}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Detail label="Date" value={fmtDate(match.best.date)} />
                    <Detail label="Location" value={match.best.location} />
                  </div>
                  <Detail
                    label="Required Skills"
                    value={
                      <div className="flex flex-wrap gap-2">
                        {match.best.requiredSkills.map((s) => (
                          <VolunteerSkillLabel
                            value={s}
                            key={s}
                            className="badge badge-outline"
                          ></VolunteerSkillLabel>
                        ))}
                      </div>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="rounded-box bg-base-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">Match Insights</h3>
                <span className="text-sm opacity-70">
                  {match.score}% alignment
                </span>
              </div>
              <progress
                className="progress progress-primary w-full"
                value={match.score}
                max={100}
              />
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <Insight
                  title="Overlapping Skills"
                  items={match.overlappingSkills}
                  badgeClass="badge-success"
                  emptyText="No overlaps"
                />
                <Insight
                  title="Missing for Event"
                  items={match.missingSkills}
                  badgeClass="badge-warning"
                  emptyText="None missing"
                />
                <Insight
                  title="Extra Volunteer Skills"
                  items={match.extraSkills}
                  badgeClass="badge-neutral"
                  emptyText="No extras"
                />
              </div>
            </div>

            <div className="card-actions justify-end">
              {/* <button className="btn btn-ghost">View Volunteer</button> */}
              {/* <button className="btn btn-ghost">View Event</button> */}
              <button
                className="btn btn-primary"
                onClick={handleAssign}
                disabled={alreadyAssigned || isLoading}
              >
                {alreadyAssigned ? "Already assigned" : "Assign Volunteer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <span className="text-sm">
    <span className="font-semibold">{label}:</span>{" "}
    <span className="text-base-content/80">{value}</span>
  </span>
);

const Insight = ({
  title,
  items,
  badgeClass,
  emptyText,
}: {
  title: string;
  items: number[];
  badgeClass: string;
  emptyText: string;
}) => (
  <span>
    <span className="mb-1 text-sm font-semibold">{title}</span>
    {items.length ? (
      <span className="flex flex-wrap gap-2">
        {items.map((i) => (
          <VolunteerSkillLabel
            key={i}
            value={i}
            className={`badge ${badgeClass} badge-outline`}
          ></VolunteerSkillLabel>
        ))}
      </span>
    ) : (
      <span className="text-sm opacity-70">{emptyText}</span>
    )}
  </span>
);

export default VolunteerMatchingPage;
