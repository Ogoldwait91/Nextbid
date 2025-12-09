// src/data/oliProfile.ts

// Simple preference profile for development.
// Later we can generalise this to a full PreferenceProfile type.
export interface PreferenceProfile {
  id: string;
  name: string;
  fleet: "B777";
  seat: "FO" | "CAPT";
  seniorityNumber: number;

  preferredDestinations: string[];
  avoidDestinations: string[];

  // We won't use these yet, but they're here for future scoring logic.
  preferLongTrips: boolean;
  preferBackToBackTrips: boolean;
  preferLongLayovers: boolean;

  minDaysOffPerMonth: number;
  maxBlockHoursPerMonth?: number;
  maxConsecutiveDutyDays?: number;

  reserveAvoidanceLevel: "OK" | "AVOID" | "HATE";
}

export const oliProfile: PreferenceProfile = {
  id: "profile-oli-777",
  name: "Oli – 777 FO",
  fleet: "B777",
  seat: "FO",
  seniorityNumber: 1234,

  // Think like BidNav: DXB / ATL strong, BOM avoid.
  preferredDestinations: ["DXB", "ATL"],
  avoidDestinations: ["BOM"],

  preferLongTrips: true,
  preferBackToBackTrips: false,
  preferLongLayovers: true,

  minDaysOffPerMonth: 10,
  maxBlockHoursPerMonth: 85,
  maxConsecutiveDutyDays: 4,

  reserveAvoidanceLevel: "AVOID",
};
