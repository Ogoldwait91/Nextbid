// src/rules/types.ts

// Trip pools L-- to H++ from the JSS aide memoire.
export type TripPool =
  | "L--"
  | "L-"
  | "L"
  | "H"
  | "H+"
  | "H++";

// Two main command families from JSS: AWARD / AVOID.
export type CommandKind = "AWARD" | "AVOID";

// Starter set of trip properties (we'll expand later).
export type TripProperty =
  | "DESTINATION"
  | "TRIP_NUMBER"
  | "TRIP_LENGTH"
  | "CREDIT_TIME"
  | "BLOCK_TIME"
  | "LAYOVER_WITH_LENGTH"
  | "ON_DUTY_WITHIN"
  | "TRIP_START_TIME"
  | "TRIP_REPORT_TIME";

// Simple date range for a bid (optional).
export interface DateRange {
  from?: string; // e.g. "2025-01-01"
  to?: string;   // e.g. "2025-01-31"
}

// One JSS-style trip-property command, before turning into text.
export interface TripPropertyCommand {
  kind: CommandKind;          // AWARD or AVOID
  property: TripProperty;     // e.g. DESTINATION
  qualifier?: string;         // e.g. "DXB", "BOM", ">= 18:00"
  dateRange?: DateRange;      // optional date range
  tripPool?: TripPool;        // e.g. H++, L-- (AWARD only)
  limit?: number;             // Max times/roster (optional)
  note?: string;              // explanation for the pilot
}
