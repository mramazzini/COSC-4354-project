"use client";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useMemo } from "react";

export type Urgency = "Low" | "Medium" | "High";

export type EventFormValues = {
  id?: string | number;
  name: string;
  description: string;
  location: string;
  requiredSkills: string[]; // multi-select
  urgency: Urgency | ""; // dropdown
  date: string; // YYYY-MM-DD
};

type Props = {
  initialValues?: Partial<EventFormValues>;
  allSkills: string[];
  onSubmit: (values: EventFormValues) => void | Promise<void>;
  onCancel?: () => void;
  urgencies?: Urgency[];
};

const MAX_NAME = 100;

const baseInitial: EventFormValues = {
  name: "",
  description: "",
  location: "",
  requiredSkills: [],
  urgency: "",
  date: "",
};

export default function EventManagementForm({
  initialValues,
  allSkills,
  onSubmit,
  onCancel,
  urgencies = ["Low", "Medium", "High"],
}: Props) {
  const init = useMemo<EventFormValues>(
    () => ({ ...baseInitial, ...(initialValues ?? {}) }),
    [initialValues]
  );

  const validate = (v: EventFormValues) => {
    const errors: Partial<Record<keyof EventFormValues, string>> = {};
    if (!v.name.trim()) errors.name = "Event name is required.";
    else if (v.name.length > MAX_NAME)
      errors.name = `Max ${MAX_NAME} characters.`;
    if (!v.description.trim()) errors.description = "Description is required.";
    if (!v.location.trim()) errors.location = "Location is required.";
    if (!v.requiredSkills || v.requiredSkills.length === 0)
      errors.requiredSkills = "Select at least one skill.";
    if (!v.urgency) errors.urgency = "Choose an urgency.";
    if (!v.date) errors.date = "Select a date.";
    return errors;
  };

  return (
    <Formik
      initialValues={init}
      validate={validate}
      enableReinitialize
      onSubmit={async (values, actions) => {
        await onSubmit({
          ...values,
          name: values.name.trim(),
          description: values.description.trim(),
          location: values.location.trim(),
        });
        actions.setSubmitting(false);
      }}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
            <div className="flex items-center gap-2 p-4 pb-0">
              <div className="grow">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 opacity-40"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                  {values.id ? "Edit Event" : "Create Event"}
                </div>
              </div>
            </div>

            <div className="card-body gap-4">
              {/* Event Name */}
              <div className="flex flex-col gap-1">
                <label
                  className="input input-border flex max-w-none items-center gap-2"
                  htmlFor="name"
                >
                  {/* icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path d="M3 3h10v2H3zM3 7h10v2H3zM3 11h7v2H3z" />
                  </svg>
                  <Field
                    id="name"
                    name="name"
                    placeholder="Event Name"
                    maxLength={MAX_NAME}
                  />
                </label>
                <div className="flex justify-between text-[0.6875rem]">
                  <ErrorMessage
                    name="name"
                    component="span"
                    className="text-error"
                  />
                  <span className="opacity-70">
                    {values.name.length}/{MAX_NAME}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="label" htmlFor="description">
                  <span className="label-text font-semibold">
                    Event Description *
                  </span>
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="textarea textarea-bordered min-h-28"
                  placeholder="Describe tasks, goals, and impact…"
                />
                <ErrorMessage
                  name="description"
                  component="span"
                  className="text-error text-sm"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1">
                <label className="label" htmlFor="location">
                  <span className="label-text font-semibold">Location *</span>
                </label>
                <Field
                  as="textarea"
                  id="location"
                  name="location"
                  className="textarea textarea-bordered min-h-20"
                  placeholder="Address or meeting point; include arrival notes."
                />
                <ErrorMessage
                  name="location"
                  component="span"
                  className="text-error text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="label" htmlFor="requiredSkills">
                  <span className="label-text font-semibold">
                    Required Skills *
                  </span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {allSkills.map((s) => {
                    const active = values.requiredSkills.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => {
                          const set = new Set(values.requiredSkills);
                          if (set.has(s)) set.delete(s);
                          else set.add(s);
                          setFieldValue("requiredSkills", Array.from(set));
                        }}
                        className={`badge badge-lg ${
                          active ? "badge-primary" : "badge-outline"
                        } cursor-pointer`}
                        aria-pressed={active}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                <ErrorMessage
                  name="requiredSkills"
                  component="span"
                  className="text-error text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="label" htmlFor="urgency">
                  <span className="label-text font-semibold">Urgency *</span>
                </label>
                <Field
                  as="select"
                  id="urgency"
                  name="urgency"
                  className="select select-bordered"
                >
                  <option value="">Select urgency…</option>
                  {urgencies.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="urgency"
                  component="span"
                  className="text-error text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="label" htmlFor="date">
                  <span className="label-text font-semibold">Event Date *</span>
                </label>
                <Field
                  id="date"
                  name="date"
                  type="date"
                  className="input input-bordered"
                />
                <ErrorMessage
                  name="date"
                  component="span"
                  className="text-error text-sm"
                />
              </div>

              <div className="card-actions items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {values.id ? "Save Changes" : "Create Event"}
                </button>
                {onCancel && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
