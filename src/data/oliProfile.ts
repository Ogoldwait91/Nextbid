// src/data/oliProfile.ts

export type DayPreference = "PREFER_WORK" | "NEUTRAL" | "PREFER_OFF";

export interface TripLengthPreference {
  mode: "AWARD" | "AVOID";
  minDays: number;
  maxDays?: number; // if undefined, means "minDays or more"
}

// Simple preference profile for development.
export interface PreferenceProfile {
  id: string;
  name: string;
  fleet: "B777";
  seat: "FO" | "CAPT";
  seniorityNumber: number;

  preferredDestinations: string[];
  avoidDestinations: string[];

  preferLongTrips: boolean; // legacy, kept for now
  preferBackToBackTrips: boolean;
  preferLongLayovers: boolean;

  minDaysOffPerMonth: number;
  maxBlockHoursPerMonth?: number;
  maxConsecutiveDutyDays?: number;

  reserveAvoidanceLevel: "OK" | "AVOID" | "HATE";

  // Time-of-day preferences (optional)
  earliestPreferredReportTime?: string; // e.g. "07:00"
  latestPreferredReportTime?: string;   // e.g. "22:00"

  // Trip length rule (new)
  tripLengthPreference?: TripLengthPreference;

  // Weekly pattern (for future use – UX only for now)
  dayPreferences: {
    mon: DayPreference;
    tue: DayPreference;
    wed: DayPreference;
    thu: DayPreference;
    fri: DayPreference;
    sat: DayPreference;
    sun: DayPreference;
  };
}

export const oliProfile: PreferenceProfile = {
  id: "profile-oli-777",
  name: "Oli – 777 FO",
  fleet: "B777",
  seat: "FO",
  seniorityNumber: 1234,

  preferredDestinations: ["DXB", "ATL"],
  avoidDestinations: ["BOM"],

  preferLongTrips: true, // currently unused by the builder if tripLengthPreference is set
  preferBackToBackTrips: false,
  preferLongLayovers: true,

  minDaysOffPerMonth: 10,
  maxBlockHoursPerMonth: 85,
  maxConsecutiveDutyDays: 4,

  reserveAvoidanceLevel: "AVOID",

  // Defaults for the dashboard demo
  earliestPreferredReportTime: "07:00",
  latestPreferredReportTime: "22:00",

  // Default trip length rule: award 4–5 day trips
  tripLengthPreference: {
    mode: "AWARD",
    minDays: 4,
    maxDays: 5,
  },

  // Weekly pattern – placeholder
  dayPreferences: {
    mon: "PREFER_WORK",
    tue: "PREFER_WORK",
    wed: "NEUTRAL",
    thu: "NEUTRAL",
    fri: "PREFER_OFF",
    sat: "PREFER_OFF",
    sun: "NEUTRAL",
  },
};
