"use client";

import { useMemo } from "react";
import EventManagementForm, {
  EventFormValues,
  Urgency,
} from "@/components/Forms/EventManagementForm";

const EventManagementPage = () => {
  // Toggle this to quickly switch between "edit" (prefilled) and "create" (blank)
  const useEditDemo = true;

  // Demo skill options
  const allSkills = [
    "Logistics",
    "First Aid",
    "Cooking",
    "Childcare",
    "Spanish",
    "Photography",
    "Crowd Management",
    "Event Setup",
  ];

  // Helper for YYYY-MM-DD
  const toDateInput = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const initialValues: Partial<EventFormValues> | undefined = useMemo(() => {
    if (!useEditDemo) return undefined; // blank create form

    const inTwoWeeks = new Date();
    inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);

    return {
      id: 101,
      name: "Community Park Cleanup",
      description:
        "Join us to remove debris, trim light brush, and refresh signage on the east trail. Gloves provided.",
      location:
        "123 Greenway Ave, Houston, TX 77002 — Meet at the pavilion near the east lot.",
      requiredSkills: ["Logistics", "Event Setup", "First Aid"],
      urgency: "Medium" as Urgency,
      date: toDateInput(inTwoWeeks),
    };
  }, [useEditDemo]);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <EventManagementForm
        initialValues={initialValues}
        allSkills={allSkills}
        onSubmit={async (vals) => {
          // Demo handler: pretend to save
          console.log("Submitted demo values:", vals);
          alert(`Submitted!\n\n${JSON.stringify(vals, null, 2)}`);
        }}
        onCancel={() => alert("Canceled")}
      />
    </div>
  );
};

export default EventManagementPage;
