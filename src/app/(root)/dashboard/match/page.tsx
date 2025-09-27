"use client";

import { useMemo, useState } from "react";

// If you already have these enums/types, swap these stubs for your imports:
// import { Event, EventUrgency, VolunteerSkill } from "@/types/Models.types";

type EventUrgency = "Low" | "Medium" | "High";
type VolunteerSkill =
  | "Gardening"
  | "Construction"
  | "Driving"
  | "ElderlyCare"
  | "FirstAid"
  | "Childcare"
  | "Logistics"
  | "EventSetup";

type EventItem = {
  id: string;
  name: string;
  description: string;
  location: string;
  requiredSkills: VolunteerSkill[];
  date: string; // ISO
  urgency: EventUrgency;
};

type Volunteer = {
  id: string;
  name: string;
  skills: VolunteerSkill[];
  interests?: string[];
  availability?: string; // e.g., "Weekends, Mornings"
};

// --- Dummy data ---
const volunteers: Volunteer[] = [
  {
    id: "v1",
    name: "Alex Johnson",
    skills: ["Logistics", "FirstAid", "EventSetup"],
    interests: ["Outdoors", "Cleanup"],
    availability: "Weekends, Mornings",
  },
  {
    id: "v2",
    name: "Priya Shah",
    skills: ["ElderlyCare", "Childcare"],
    interests: ["Community Care", "Education"],
    availability: "Weekdays, Afternoons",
  },
  {
    id: "v3",
    name: "Marco Lee",
    skills: ["Driving", "Construction"],
    interests: ["Food Security"],
    availability: "Weeknights",
  },
];

const events: EventItem[] = [
  {
    id: "e1",
    name: "Neighborhood Tree Planting",
    description:
      "Help plant native trees along the greenway. Bring closed-toe shoes.",
    location: "Creekside Trailhead",
    requiredSkills: ["Gardening", "EventSetup", "Logistics"],
    date: new Date(Date.now() + 5 * 86400000).toISOString(),
    urgency: "Medium",
  },
  {
    id: "e2",
    name: "Food Pantry Restock",
    description: "Unload deliveries, sort donations, and prep family boxes.",
    location: "2nd Street Community Pantry",
    requiredSkills: ["Driving", "Logistics", "Construction"],
    date: new Date(Date.now() + 2 * 86400000).toISOString(),
    urgency: "High",
  },
  {
    id: "e3",
    name: "Elderly Tech Help Hour",
    description:
      "One-on-one help with phones and tablets for senior residents.",
    location: "Sunrise Care Home",
    requiredSkills: ["ElderlyCare", "FirstAid"],
    date: new Date(Date.now() + 9 * 86400000).toISOString(),
    urgency: "Low",
  },
];

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
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(
    volunteers[0].id
  );

  const volunteer = useMemo(
    () => volunteers.find((v) => v.id === selectedVolunteerId)!,
    [selectedVolunteerId]
  );

  const match = useMemo(() => computeMatch(volunteer, events), [volunteer]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Volunteer Matching</h1>
          <p className="italic text-base-content/80">
            Select a volunteer to auto-fill a recommended event based on skills.
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
                <span className="label-text font-semibold">Volunteer Name</span>
                <span className="badge badge-outline">Auto-filled</span>
              </label>
              <select
                id="volunteer"
                className="select select-bordered"
                value={selectedVolunteerId}
                onChange={(e) => setSelectedVolunteerId(e.target.value)}
              >
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-base-content/70">
                Loaded from volunteers database (demo).
              </p>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="event">
                <span className="label-text font-semibold">Matched Event</span>
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
                  <span className="badge">Volunteer</span>
                </div>
                {volunteer.availability && (
                  <Detail label="Availability" value={volunteer.availability} />
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
                        <span
                          key={s}
                          className="badge badge-neutral badge-outline"
                        >
                          {s}
                        </span>
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
                  <span className={`badge ${urgencyBadge(match.best.urgency)}`}>
                    {match.best.urgency}
                  </span>
                </div>
                <p className="text-base-content/80">{match.best.description}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Detail label="Date" value={fmtDate(match.best.date)} />
                  <Detail label="Location" value={match.best.location} />
                </div>
                <Detail
                  label="Required Skills"
                  value={
                    <div className="flex flex-wrap gap-2">
                      {match.best.requiredSkills.map((s) => (
                        <span key={s} className="badge badge-outline">
                          {s}
                        </span>
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
            <button className="btn btn-ghost">View Volunteer</button>
            <button className="btn btn-ghost">View Event</button>
            <button className="btn btn-primary" disabled>
              Assign Volunteer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <p className="text-sm">
    <span className="font-semibold">{label}:</span>{" "}
    <span className="text-base-content/80">{value}</span>
  </p>
);

const Insight = ({
  title,
  items,
  badgeClass,
  emptyText,
}: {
  title: string;
  items: string[];
  badgeClass: string;
  emptyText: string;
}) => (
  <div>
    <div className="mb-1 text-sm font-semibold">{title}</div>
    {items.length ? (
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i} className={`badge ${badgeClass} badge-outline`}>
            {i}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-sm opacity-70">{emptyText}</span>
    )}
  </div>
);

export default VolunteerMatchingPage;
