import React from "react";

export const volunteerSkillLabels = [
  "Cooking", // 0
  "Driving", // 1
  "Teaching", // 2
  "Cleaning", // 3
  "Fundraising", // 4
  "MedicalAid", // 5
  "Counseling", // 6
  "EventPlanning", // 7
  "ChildCare", // 8
  "ElderlyCare", // 9
  "AnimalCare", // 10
  "Construction", // 11
  "Gardening", // 12
  "ITSupport", // 13
  "Marketing", // 14
  "Photography", // 15
  "Writing", // 16
  "Translation", // 17
  "LegalAid", // 18
] as const;

type VolunteerSkillLabelProps = {
  value: number | null | undefined;
  fallback?: React.ReactNode;
  className?: string;
};

export const VolunteerSkillLabel: React.FC<VolunteerSkillLabelProps> = ({
  value,
  fallback = "Unknown skill",
  className,
}) => {
  if (value == null) {
    return <span className={className}>{fallback}</span>;
  }

  const label = volunteerSkillLabels[value];

  if (!label) {
    return <span className={className}>{fallback}</span>;
  }

  return <span className={className}>{label}</span>;
};
