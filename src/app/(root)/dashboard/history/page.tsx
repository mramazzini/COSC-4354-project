"use client";

import { useGetVolunteerHistoryQuery } from "@/lib/services/eventApi";
import { useMemo, useState } from "react";

const volunteerSkillLabels: string[] = [
  "Cooking",
  "Driving",
  "Teaching",
  "Cleaning",
  "Fundraising",
  "MedicalAid",
  "Counseling",
  "EventPlanning",
  "ChildCare",
  "ElderlyCare",
  "AnimalCare",
  "Construction",
  "Gardening",
  "ITSupport",
  "Marketing",
  "Photography",
  "Writing",
  "Translation",
  "LegalAid",
];

const urgencyLabels: string[] = ["Low", "Medium", "High"];

const skillLabel = (s: number) => volunteerSkillLabels[s] ?? `Skill ${s}`;
const urgencyLabel = (u: number) => urgencyLabels[u] ?? `Urgency ${u}`;

const urgencyColor = (u: number) => {
  const label = urgencyLabel(u).toLowerCase();
  if (label.includes("high")) return "badge-error";
  if (label.includes("medium")) return "badge-warning";
  return "badge-success";
};

const HistoryPage = () => {
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string>("All");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");
  const [sort, setSort] = useState<"newest" | "oldest" | "urgency">("newest");

  const { data: history = [] } = useGetVolunteerHistoryQuery();

  const allSkills = useMemo(
    () =>
      Array.from(
        new Set(
          history.flatMap((e) =>
            e.requiredSkills.map((s: number) => skillLabel(s))
          )
        )
      ).sort(),
    [history]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = history.filter((e) => {
      const name = e.name.toLowerCase();
      const description = e.description.toLowerCase();
      const location = e.location.toLowerCase();
      const urgencyText = urgencyLabel(e.urgency).toLowerCase();

      const matchesQuery =
        !q ||
        name.includes(q) ||
        description.includes(q) ||
        location.includes(q);

      const matchesSkill =
        skillFilter === "All" ||
        e.requiredSkills
          .map((s: number) => skillLabel(s))
          .includes(skillFilter);

      const matchesUrgency =
        urgencyFilter === "All" || urgencyText === urgencyFilter.toLowerCase();

      return matchesQuery && matchesSkill && matchesUrgency;
    });

    if (sort === "newest") {
      list = list
        .slice()
        .sort(
          (a, b) => +new Date(b.dateIsoString) - +new Date(a.dateIsoString)
        );
    } else if (sort === "oldest") {
      list = list
        .slice()
        .sort(
          (a, b) => +new Date(a.dateIsoString) - +new Date(b.dateIsoString)
        );
    } else if (sort === "urgency") {
      const rank = (u: number) => {
        const label = urgencyLabel(u).toLowerCase();
        if (label.includes("high")) return 0;
        if (label.includes("medium")) return 1;
        return 2;
      };
      list = list.slice().sort((a, b) => rank(a.urgency) - rank(b.urgency));
    }

    return list;
  }, [query, history, sort, skillFilter, urgencyFilter]);

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
            const date = new Date(event.dateIsoString);
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
                      {urgencyLabel(event.urgency)}
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
                        <span className="flex flex-wrap gap-2">
                          {event.requiredSkills.map((s: number) => (
                            <span key={s} className="badge badge-outline">
                              {skillLabel(s)}
                            </span>
                          ))}
                        </span>
                      }
                    />
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
