"use client";

import { useCallback, useMemo, useState } from "react";
import EventManagementForm, {
  EventFormValues,
  Urgency,
} from "@/components/Forms/EventManagementForm";
import {
  useUpdateEventMutation,
  useGetUpcomingEventsQuery,
} from "@/lib/services/eventApi";
import { AdminGuard } from "@/components/Auth/AdminGuard";

const EventManagementPage = () => {
  const [selectedId, setSelectedId] = useState<string>("new");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: events = [], isLoading: isLoadingEvents } =
    useGetUpcomingEventsQuery();

  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const toDateInput = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const allSkills = useMemo(
    () =>
      Array.from(
        new Set(
          events.flatMap((e) => e.requiredSkills.map((s) => String(s).trim()))
        )
      ).sort(),
    [events]
  );

  const initialValues: Partial<EventFormValues> | undefined = useMemo(() => {
    if (selectedId === "new") return undefined;
    const evt = events.find((e) => e.id === selectedId);
    if (!evt) return undefined;

    const date = new Date(evt.dateIsoString);
    return {
      id: evt.id,
      name: evt.name,
      description: evt.description,
      location: evt.location,
      requiredSkills: evt.requiredSkills.map((s) => String(s)),
      urgency: String(evt.urgency) as Urgency,
      date: toDateInput(date),
    };
  }, [selectedId, events]);

  const handleSubmit = useCallback(
    async (vals: EventFormValues) => {
      setSuccessMessage(null);
      setErrorMessage(null);

      const dateUtc = new Date(`${vals.date}T09:00:00`).toISOString();

      try {
        await updateEvent({
          id: selectedId === "new" ? undefined : selectedId,
          name: vals.name.trim(),
          description: vals.description.trim(),
          location: vals.location.trim(),
          requiredSkills: vals.requiredSkills,
          urgency: vals.urgency as Urgency,
          dateUtc,
        }).unwrap();
        setSuccessMessage("Event updated successfully.");
      } catch (err) {
        console.error("Failed to save event", err);
        setErrorMessage("Failed to save event. Please try again.");
      }
    },
    [selectedId, updateEvent]
  );

  const isSaving = isUpdating;

  const currentModeTitle =
    selectedId === "new" || !initialValues?.id ? "Create Event" : "Edit Event";

  return (
    <AdminGuard>
      <div className="mx-auto max-w-3xl p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{currentModeTitle}</h1>
            <p className="text-sm text-base-content/70">
              Choose an existing event to edit, or start a new one.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <select
              className="select select-bordered select-sm w-full sm:w-64"
              value={selectedId}
              onChange={(e) => {
                setSuccessMessage(null);
                setErrorMessage(null);
                setSelectedId(e.target.value);
              }}
            >
              <option value="new">➕ New event</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>

            {isSaving && (
              <span className="text-xs italic text-base-content/70">
                Saving changes…
              </span>
            )}
            {isLoadingEvents && (
              <span className="text-xs italic text-base-content/70">
                Loading events…
              </span>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="alert alert-success text-sm">
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error text-sm">
            <span>{errorMessage}</span>
          </div>
        )}

        <EventManagementForm
          initialValues={initialValues}
          allSkills={allSkills}
          onSubmit={handleSubmit}
          onCancel={() => {
            // simple cancel: reset selection back to "new"
            setSelectedId("new");
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
        />
      </div>
    </AdminGuard>
  );
};

export default EventManagementPage;
