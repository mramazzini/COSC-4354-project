// TODO: Hook up prisma models
// This is just a placeholder because assignment 2 wants me to start with UI first for whatever reason.

export enum VolunteerSkill {
  Cooking = "Cooking",
  Driving = "Driving",
  Teaching = "Teaching",
  Cleaning = "Cleaning",
  Fundraising = "Fundraising",
  MedicalAid = "Medical Aid",
  Counseling = "Counseling",
  EventPlanning = "Event Planning",
  ChildCare = "Child Care",
  ElderlyCare = "Elderly Care",
  AnimalCare = "Animal Care",
  Construction = "Construction",
  Gardening = "Gardening",
  ITSupport = "IT Support",
  Marketing = "Marketing",
  Photography = "Photography",
  Writing = "Writing",
  Translation = "Translation",
  LegalAid = "Legal Aid",
}

export enum EventUrgency {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical",
}

export enum UserRole {
  Admin = "Admin",
  Volunteer = "Volunteer",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  addressOne: string;
  addressTwo: string;
  city: string;
  state: string;
  zipCode: string;
  skills: VolunteerSkill[];
  otherSkills: string[];
  preferences: string;
  availability: string[]; // array of ISO strings
  role: UserRole;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  requiredSkills: VolunteerSkill[];
  urgency: EventUrgency;
  date: string; // ISO string
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO string
}
