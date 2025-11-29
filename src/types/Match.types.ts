export type EventUrgency = "Low" | "Medium" | "High";

export type EventItem = {
  id: string;
  name: string;
  description: string;
  location: string;
  requiredSkills: number[];
  date: string;
  urgency: EventUrgency;
};

export type Volunteer = {
  id: string;
  name: string;
  skills: number[];
  interests?: string[];
  availability?: string;
};
