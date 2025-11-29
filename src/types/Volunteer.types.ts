export interface AssignVolunteerRequest {
  volunteerId: string;
  durationMinutes?: number;
}

export interface AssignVolunteerResponse {
  volunteerHistoryId: string;
  eventId: string;
  volunteerId: string;
  dateUtc: string;
  durationMinutes: number;
}
