// src/data/oliProfile.ts

export type DayPreference = "PREFER_WORK" | "NEUTRAL" | "PREFER_OFF";

export type TripPool = "L--" | "L-" | "L" | "H" | "H+" | "H++";

export interface TripLengthRule {
  id: string;
  mode: "AWARD" | "AVOID";
  minDays: number;
  maxDays?: number; // if undefined, means "minDays or more"
  tripPool?: TripPool; // usually only for AWARD
}

export interface DestinationRule {
  id: string;
  mode: "AWARD" | "AVOID";
  qualifier: string; // e.g. "DXB", "ATL", "MIDDLE EAST"
  tripPool?: TripPool; // for AWARD lines
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

  // Legacy flags (can be phased out as rules take over)
  preferLongTrips: boolean;
  preferBackToBackTrips: boolean;
  preferLongLayovers: boolean;

  minDaysOffPerMonth: number;
  maxBlockHoursPerMonth?: number;
  maxConsecutiveDutyDays?: number;

  reserveAvoidanceLevel: "OK" | "AVOID" | "HATE";

  // Time-of-day preferences (optional)
  earliestPreferredReportTime?: string; // e.g. "07:00"
  latestPreferredReportTime?: string;   // e.g. "22:00"

  // Trip length rules – multiple allowed
  tripLengthRules?: TripLengthRule[];

  // Destination rules – multiple allowed
  destinationRules?: DestinationRule[];

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

  // These can be used as a fallback if no destinationRules are defined
  preferredDestinations: ["DXB", "ATL"],
  avoidDestinations: ["BOM"],

  preferLongTrips: true, // legacy
  preferBackToBackTrips: false,
  preferLongLayovers: true,

  minDaysOffPerMonth: 10,
  maxBlockHoursPerMonth: 85,
  maxConsecutiveDutyDays: 4,

  reserveAvoidanceLevel: "AVOID",

  // Defaults for the dashboard demo
  earliestPreferredReportTime: "07:00",
  latestPreferredReportTime: "22:00",

  // Example trip length rules:
  // Award 4-day trips, avoid 5 days or more.
  tripLengthRules: [
    {
      id: "len-award-4d",
      mode: "AWARD",
      minDays: 4,
      maxDays: 4,
      tripPool: "H+",
    },
    {
      id: "len-avoid-5plus",
      mode: "AVOID",
      minDays: 5,
    },
  ],

  // Example destination rules: award DXB/ATL
  destinationRules: [
    {
      id: "dest-award-dxb",
      mode: "AWARD",
      qualifier: "DXB",
      tripPool: "H++",
    },
    {
      id: "dest-award-atl",
      mode: "AWARD",
      qualifier: "ATL",
      tripPool: "H+",
    },
    // We will still use avoidDestinations + the BOM toggle for now
  ],

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
