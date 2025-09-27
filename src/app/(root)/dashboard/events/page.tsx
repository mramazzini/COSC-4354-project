"use client";
import { useMemo, useState } from "react";
import { Event, EventUrgency, VolunteerSkill } from "@/types/Models.types";

type UpcomingEvent = Event & { spots?: number; isRemote?: boolean };

const urgencyColor = (u: string) => {
  const key = u.toLowerCase();
  if (key.includes("high")) return "badge-error";
  if (key.includes("medium")) return "badge-warning";
  return "badge-success";
};

const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

const upcomingSeed: UpcomingEvent[] = [
  {
    id: "e-101",
    name: "Neighborhood Tree Planting",
    description:
      "Help plant 50+ native trees along the creek trail. Wear closed-toe shoes.",
    location: "Creekside Trailhead",
    requiredSkills: [VolunteerSkill.Gardening],
    date: addDays(5),
    urgency: EventUrgency.Medium,
    spots: 18,
  },
  {
    id: "e-102",
    name: "Food Pantry Restock",
    description:
      "Unload deliveries, sort donations, and prep weekend family boxes.",
    location: "2nd Street Community Pantry",
    requiredSkills: [VolunteerSkill.Driving, VolunteerSkill.Construction],
    date: addDays(1),
    urgency: EventUrgency.High,
    spots: 6,
  },
  {
    id: "e-103",
    name: "Elderly Tech Help Hour",
    description:
      "One-on-one help with phones and tablets. Patient communicators welcome.",
    location: "Sunrise Care Home",
    requiredSkills: [VolunteerSkill.ElderlyCare],
    date: addDays(14),
    urgency: EventUrgency.Low,
    spots: 10,
    isRemote: false,
  },
  {
    id: "e-104",
    name: "Virtual Grant Writing Sprint",
    description:
      "Remote session to polish proposals for next quarter’s funding cycle.",
    location: "Remote (Zoom link on RSVP)",
    requiredSkills: [VolunteerSkill.EventPlanning],
    date: addDays(3),
    urgency: EventUrgency.Medium,
    spots: 25,
    isRemote: true,
  },
];

const daysUntil = (iso: string) => {
  const now = new Date();
  const d = new Date(iso);
  const diff = Math.ceil((+d - +now) / (1000 * 60 * 60 * 24));
  return diff;
};

const UpcomingEventsPage = () => {
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string>("All");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");
  const [sort, setSort] = useState<"soonest" | "latest" | "urgency">("soonest");

  const events = useMemo(() => {
    const now = new Date();
    return upcomingSeed.filter((e) => new Date(e.date) > now);
  }, []);

  const allSkills = useMemo(
    () =>
      Array.from(
        new Set(
          events.flatMap((e) => e.requiredSkills.map((s) => `${s}`.trim()))
        )
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
        e.requiredSkills.map(String).includes(skillFilter);

      const matchesUrgency =
        urgencyFilter === "All" ||
        `${e.urgency}`.toLowerCase() === urgencyFilter.toLowerCase();

      return matchesQuery && matchesSkill && matchesUrgency;
    });

    if (sort === "soonest") {
      list = list.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    } else if (sort === "latest") {
      list = list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    } else if (sort === "urgency") {
      const rank = (u: string) =>
        u.toLowerCase().includes("high")
          ? 0
          : u.toLowerCase().includes("medium")
          ? 1
          : 2;
      list = list.sort((a, b) => rank(`${a.urgency}`) - rank(`${b.urgency}`));
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
            <div className="stat-value text-primary">{filtered.length}</div>
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e) => setSort(e.target.value as any)}
        >
          <option value="soonest">Sort: Soonest first</option>
          <option value="latest">Sort: Latest first</option>
          <option value="urgency">Sort: Urgency</option>
        </select>
      </div>

      {filtered.length === 0 ? (
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
          {filtered.map((event) => {
            const date = new Date(event.date);
            const pretty = date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const inDays = daysUntil(event.date);

            return (
              <div
                key={event.id}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="card-title leading-tight">{event.name}</h2>
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${urgencyColor(
                          `${event.urgency}`
                        )} badge-lg`}
                      >
                        {event.urgency}
                      </span>
                      <span className="badge badge-outline badge-lg">
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
                      <Detail
                        label="Open Spots"
                        value={event.spots.toString()}
                      />
                    )}
                    <Detail
                      label="Required Skills"
                      value={
                        <div className="flex flex-wrap gap-2">
                          {event.requiredSkills.map((s) => (
                            <span
                              key={s as VolunteerSkill}
                              className="badge badge-outline"
                            >
                              {String(s)}
                            </span>
                          ))}
                        </div>
                      }
                    />
                  </div>

                  <div className="card-actions justify-end pt-2">
                    <button className="btn btn-ghost btn-sm">Details</button>
                    <button className="btn btn-primary btn-sm">RSVP</button>
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

export default UpcomingEventsPage;
