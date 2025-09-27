"use client";
import { useMemo, useState } from "react";
import { Event, EventUrgency, VolunteerSkill } from "@/types/Models.types";
type EventWithTime = Event & { timeAtEvent: string };

const history: EventWithTime[] = [
  {
    id: "1",
    name: "Community Clean-Up",
    description: "Participated in a local park clean-up event.",
    location: "Central Park",
    requiredSkills: [VolunteerSkill.Gardening, VolunteerSkill.Construction],
    date: "2023-09-15T10:00:00Z",
    urgency: EventUrgency.Medium,
    timeAtEvent: "3 hours",
  },
  {
    id: "2",
    name: "Food Drive Assistance",
    description: "Helped organize and distribute food donations.",
    location: "Community Center",
    requiredSkills: [VolunteerSkill.Driving],
    date: "2023-10-05T14:00:00Z",
    urgency: EventUrgency.High,
    timeAtEvent: "4 hours",
  },
  {
    id: "3",
    name: "Elderly Care Visit",
    description: "Spent time with elderly residents at a care home.",
    location: "Sunrise Care Home",
    requiredSkills: [VolunteerSkill.ElderlyCare],
    date: "2023-11-20T09:00:00Z",
    urgency: EventUrgency.Low,
    timeAtEvent: "2 hours",
  },
];

const urgencyColor = (u: string) => {
  const key = u.toLowerCase();
  if (key.includes("high")) return "badge-error";
  if (key.includes("medium")) return "badge-warning";
  return "badge-success";
};

const HistoryPage = () => {
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string>("All");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");
  const [sort, setSort] = useState<"newest" | "oldest" | "urgency">("newest");

  const allSkills = useMemo(
    () =>
      Array.from(
        new Set(history.flatMap((e) => e.requiredSkills.map((s) => s.trim())))
      ).sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = history.filter((e) => {
      const matchesQuery =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.requiredSkills.some((s) => s.toLowerCase().includes(q));

      const matchesSkill =
        skillFilter === "All" ||
        e.requiredSkills.includes(skillFilter as VolunteerSkill);

      const matchesUrgency =
        urgencyFilter === "All" ||
        e.urgency.toLowerCase() === urgencyFilter.toLowerCase();

      return matchesQuery && matchesSkill && matchesUrgency;
    });

    if (sort === "newest") {
      list = list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    } else if (sort === "oldest") {
      list = list.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    } else if (sort === "urgency") {
      const rank = (u: string) =>
        u.toLowerCase().includes("high")
          ? 0
          : u.toLowerCase().includes("medium")
          ? 1
          : 2;
      list = list.sort((a, b) => rank(a.urgency) - rank(b.urgency));
    }
    return list;
  }, [query, skillFilter, urgencyFilter, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Volunteer History</h1>
          <p className="italic text-base-content/80">
            Thanks for making a difference! Here&apos;s a summary of your past
            volunteer events.
          </p>
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e) => setSort(e.target.value as any)}
        >
          <option value="newest">Sort: Newest first</option>
          <option value="oldest">Sort: Oldest first</option>
          <option value="urgency">Sort: Urgency</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="alert">
          <span>No events match your filters.</span>
          <button
            className="btn btn-sm ml-auto"
            onClick={() => {
              setQuery("");
              setSkillFilter("All");
              setUrgencyFilter("All");
              setSort("newest");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((event) => {
            const date = new Date(event.date);
            const pretty = date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <div
                key={event.id}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="card-title leading-tight">{event.name}</h2>
                    <div
                      className={`badge ${urgencyColor(
                        event.urgency
                      )} badge-lg`}
                    >
                      {event.urgency}
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-base-content/80">{event.description}</p>
                  )}

                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <Detail label="Date" value={pretty} />
                    <Detail label="Location" value={event.location} />
                    <Detail label="Time at Event" value={event.timeAtEvent} />
                    <Detail
                      label="Required Skills"
                      value={
                        <div className="flex flex-wrap gap-2">
                          {event.requiredSkills.map((s) => (
                            <span key={s} className="badge badge-outline">
                              {s}
                            </span>
                          ))}
                        </div>
                      }
                    />
                  </div>

                  <div className="card-actions justify-end pt-2">
                    <button className="btn btn-ghost btn-sm">Details</button>
                    <button className="btn btn-primary btn-sm">
                      View Summary
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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

export default HistoryPage;
