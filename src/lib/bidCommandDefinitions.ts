// High-level “what is the pilot asking for?”
export type BidCommandKind =
  | "DESTINATION"
  | "TRIP_LENGTH_DAYS"
  | "LAYOVER_WITH_LENGTH"
  | "TRIP_REPORT_TIME"
  | "TRIP_CREDIT_TIME"
  | "TRIP_NUMBER"
  | "WORK_CONTAINED_WITHIN"
  | "WORK_TOUCHING";

export type CommandVerb = "AWARD" | "AVOID";

export type TripPoolRank = "L--" | "L-" | "L" | "N" | "H" | "H+" | "H++";

export interface BidCommandDefinition {
  kind: BidCommandKind;
  label: string;            // what the pilot sees
  supportsAward: boolean;
  supportsAvoid: boolean;
  needsTripPool: boolean;   // e.g. true for normal Award, false for Avoid / work touching
  supportsLimit: boolean;
}

export const BID_COMMAND_DEFINITIONS: BidCommandDefinition[] = [
  {
    kind: "DESTINATION",
    label: "Destination / layover",
    supportsAward: true,
    supportsAvoid: true,
    needsTripPool: true,
    supportsLimit: true,
  },
  {
    kind: "TRIP_LENGTH_DAYS",
    label: "Trip length (days)",
    supportsAward: true,
    supportsAvoid: true,
    needsTripPool: true,
    supportsLimit: true,
  },
  {
    kind: "WORK_CONTAINED_WITHIN",
    label: "Work contained within dates",
    supportsAward: true,
    supportsAvoid: false,   // JSS doesn’t “avoid work contained within”
    needsTripPool: true,
    supportsLimit: false,   // bank pattern has no limit
  },
  // …etc
];
