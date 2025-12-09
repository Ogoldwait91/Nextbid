// src/types/bidding.ts

// For now we keep it simple: 777 fleet only, FO/CAPT.
export type Fleet = "B777";
export type Seat = "FO" | "CAPT";

// One published 777 pairing.
export interface Pairing {
  id: string; // e.g. "8016"
  base: "LHR" | "LGW";
  fleet: Fleet;
  creditHours: number;
  dutyDays: number;
  departureDateLocal: string; // "2025-03-01"
  arrivalDateLocal: string;   // "2025-03-04"
  layovers: string[];         // ["DXB"], ["ATL"], etc.
  patternType:
    | "OUT_AND_BACK"
    | "THREE_DAY"
    | "FOUR_DAY"
    | "MULTI_SECTOR"
    | "ULR";
  notes?: string;
}

// How a pilot describes what they like.
export interface PreferenceProfile {
  id: string;
  pilotId: string;
  fleet: Fleet;
  seat: Seat;
  seniorityNumber: number;

  preferredDestinations: string[];
  avoidDestinations: string[];
  preferLongTrips: boolean;
  preferBackToBackTrips: boolean;
  preferLongLayovers: boolean;

  minDaysOffPerMonth: number;
  maxBlockHoursPerMonth?: number;
  maxConsecutiveDutyDays?: number;

  reserveAvoidanceLevel: "OK" | "AVOID" | "HATE";

  freeTextNotes?: string;
}

// One line in the bid block.
export interface BidLine {
  lineNumber: number;        // 1–15
  strength: 1 | 2 | 3 | 4 | 5;
  command: string;           // eventually the JSS/IBID string
  description: string;       // human-readable summary
}

// A full 15-line bid plan.
export interface BidPlan {
  id: string;
  month: string;             // "2025-03"
  fleet: Fleet;
  seat: Seat;
  profileId: string;
  createdAt: string;         // ISO datetime
  bidLines: BidLine[];
  exportedJssText?: string;  // text block ready for IBID
}
