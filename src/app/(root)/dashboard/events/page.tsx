"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  useGetUpcomingEventsQuery,
  useAssignVolunteerToEventMutation,
  useGetEventAssignmentsQuery,
} from "@/lib/services/eventApi";
import type { UpcomingEvent } from "@/lib/services/eventApi";
import {
  VolunteerSkillLabel,
  volunteerSkillLabels,
} from "@/components/UI/VolunteerSkillLabel";
import { useUser } from "@/hooks/useUser";

const urgencyLabel = (u: number | string) => {
  if (typeof u === "number") {
    return u === 2 ? "High" : u === 1 ? "Medium" : "Low";
  }
  return String(u);
};

const urgencyColor = (u: number | string) => {
  const label = urgencyLabel(u).toLowerCase();
  if (label.includes("high")) return "badge-error";
  if (label.includes("medium")) return "badge-warning";
  return "badge-success";
};

const daysUntil = (iso: string) => {
  const now = new Date();
  const d = new Date(iso);
  const diff = Math.ceil((+d - +now) / (1000 * 60 * 60 * 24));
  return diff;
};

const skillLabel = (s: number) => volunteerSkillLabels[s];

const UpcomingEventsPage = () => {
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string>("All");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");
  const [sort, setSort] = useState<"soonest" | "latest" | "urgency">("soonest");

  const { data, isLoading, isError } = useGetUpcomingEventsQuery();
  const { user, loading: userLoading } = useUser();

  const events = useMemo<UpcomingEvent[]>(() => {
    if (!data) return [];
    const now = new Date();
    return data.filter((e) => new Date(e.dateIsoString) > now);
  }, [data]);

  const allSkills = useMemo(
    () =>
      Array.from(
        new Set(events.flatMap((e) => e.requiredSkills.map(skillLabel)))
      ).sort(),
    [events]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = events.filter((e) => {
      const matchesQuery =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.requiredSkills.some((s) => `${s}`.toLowerCase().includes(q));

      const matchesSkill =
        skillFilter === "All" ||
        // @ts-expect-error ignore
        e.requiredSkills.map(skillLabel).includes(skillFilter);

      const matchesUrgency =
        urgencyFilter === "All" ||
        urgencyLabel(e.urgency).toLowerCase() === urgencyFilter.toLowerCase();

      return matchesQuery && matchesSkill && matchesUrgency;
    });

    if (sort === "soonest") {
      list = list
        .slice()
        .sort(
          (a, b) => +new Date(a.dateIsoString) - +new Date(b.dateIsoString)
        );
    } else if (sort === "latest") {
      list = list
        .slice()
        .sort(
          (a, b) => +new Date(b.dateIsoString) - +new Date(a.dateIsoString)
        );
    } else if (sort === "urgency") {
      const rank = (u: string | number) => {
        const label = urgencyLabel(u).toLowerCase();
        if (label.includes("high")) return 0;
        if (label.includes("medium")) return 1;
        return 2;
      };
      list = list.slice().sort((a, b) => rank(a.urgency) - rank(b.urgency));
    }

    return list;
  }, [events, query, skillFilter, urgencyFilter, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upcoming Events</h1>
          <p className="italic text-base-content/80">
            Jump in where you’re needed most—filter by skills or urgency.
          </p>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Open Events</div>
            <div className="stat-value text-primary">
              {isLoading ? "…" : filtered.length}
            </div>
            <div className="stat-desc">matching filters</div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          placeholder="Search name, location, skills…"
          className="input input-bordered w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="select select-bordered w-full"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        >
          <option>All</option>
          {allSkills.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          className="select select-bordered w-full"
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select
          className="select select-bordered w-full"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="soonest">Sort: Soonest first</option>
          <option value="latest">Sort: Latest first</option>
          <option value="urgency">Sort: Urgency</option>
        </select>
      </div>

      {isLoading ? (
        <div className="alert">
          <span>Loading upcoming events…</span>
        </div>
      ) : isError ? (
        <div className="alert alert-error">
          <span>Could not load events. Backend not ready yet?</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="alert">
          <span>No upcoming events match your filters.</span>
          <button
            className="btn btn-sm ml-auto"
            onClick={() => {
              setQuery("");
              setSkillFilter("All");
              setUrgencyFilter("All");
              setSort("soonest");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentUserId={user?.id ?? null}
              userLoading={userLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type EventCardProps = {
  event: UpcomingEvent;
  currentUserId: string | null;
  userLoading: boolean;
};

const EventCard = ({ event, currentUserId, userLoading }: EventCardProps) => {
  const [assignVolunteer, { isLoading: isAssigning }] =
    useAssignVolunteerToEventMutation();

  const { data: assignedIds = [], isLoading: assignmentsLoading } =
    useGetEventAssignmentsQuery(event.id, {
      skip: !currentUserId,
    });

  const alreadyRsvpd = !!currentUserId && assignedIds.includes(currentUserId);

  const inDays = daysUntil(event.dateIsoString);
  const date = new Date(event.dateIsoString);
  const pretty = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleRsvp = async () => {
    if (userLoading) {
      alert("Checking your account, please wait a moment.");
      return;
    }

    if (!currentUserId) {
      alert("You must be logged in as a volunteer to RSVP.");
      return;
    }

    if (alreadyRsvpd) {
      return;
    }

    try {
      await assignVolunteer({
        eventId: event.id,
        body: {
          volunteerId: currentUserId,
          durationMinutes: 90,
        },
      }).unwrap();
      alert("RSVP successful! You’ve been assigned to this event.");
    } catch (err) {
      console.error(err);
      alert("Could not RSVP for this event. Please try again.");
    }
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="card-title leading-tight">{event.name}</h2>
            {alreadyRsvpd && (
              <span className="badge badge-success badge-outline">
                You’re signed up for this event
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`badge ${urgencyColor(
                event.urgency
              )} badge-lg whitespace-nowrap`}
            >
              {urgencyLabel(event.urgency)}
            </span>
            <span className="badge badge-outline badge-lg whitespace-nowrap">
              Starts in {inDays} day{inDays !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {event.description && (
          <p className="text-base-content/80">{event.description}</p>
        )}

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <Detail label="Date" value={pretty} />
          <Detail label="Location" value={event.location} />
          {typeof event.spots === "number" && (
            <Detail label="Open Spots" value={event.spots.toString()} />
          )}
          <Detail
            label="Required Skills"
            value={
              <span className="flex flex-wrap gap-2">
                {event.requiredSkills.map((s) => (
                  <VolunteerSkillLabel
                    key={s}
                    className="badge badge-outline"
                    value={s}
                  />
                ))}
              </span>
            }
          />
        </div>

        <div className="card-actions justify-end pt-2">
          <button className="btn btn-ghost btn-sm">Details</button>
          <button
            className={`btn btn-sm ${
              alreadyRsvpd ? "btn-success cursor-default" : "btn-primary"
            }`}
            disabled={
              alreadyRsvpd || isAssigning || userLoading || assignmentsLoading
            }
            onClick={handleRsvp}
          >
            {alreadyRsvpd ? "✅ RSVP’d" : isAssigning ? "Submitting…" : "RSVP"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: ReactNode }) => (
  <p className="text-sm">
    <span className="font-semibold">{label}:</span>{" "}
    <span className="text-base-content/80">{value}</span>
  </p>
);

export default UpcomingEventsPage;
