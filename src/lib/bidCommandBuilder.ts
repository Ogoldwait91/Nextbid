// src/lib/bidCommandBuilder.ts

import type {
  TripPool,
  CommandKind,
  TripPropertyCommand,
  DateRange,
} from "../rules/types";

/**
 * High-level command types the pilot can choose in the UI.
 * These map down to TripProperty values.
 */
export type BidCommandKind =
  | "DESTINATION"
  | "TRIP_LENGTH_DAYS"
  | "TRIP_REPORT_TIME";

/**
 * Base fields common to all UI-level commands.
 */
export interface BaseBidCommandInput {
  kind: BidCommandKind;
  verb: CommandKind; // "AWARD" | "AVOID"
  pool?: TripPool;   // Only used when verb === "AWARD"
  limit?: number;    // Max times per roster
  note?: string;     // Friendly explanation for the pilot
}

/**
 * 1) Destination command
 * One destination per command for now (simpler & matches current matcher).
 */
export interface DestinationBidCommandInput extends BaseBidCommandInput {
  kind: "DESTINATION";
  destination: string; // e.g. "MLE", "LAX", "JFK"
}

/**
 * 2) Trip length (days)
 */
export type TripLengthOperator =
  | "EQUAL"
  | "AT_LEAST"
  | "AT_MOST"
  | "BETWEEN";

export interface TripLengthBidCommandInput extends BaseBidCommandInput {
  kind: "TRIP_LENGTH_DAYS";
  operator: TripLengthOperator;
  days?: number;       // used for EQUAL / AT_LEAST / AT_MOST
  minDays?: number;    // used for BETWEEN
  maxDays?: number;    // used for BETWEEN
}

/**
 * 3) Trip report time (local)
 */
export type TimeComparisonOperator =
  | "EARLIER_THAN"
  | "NOT_EARLIER_THAN"   // >=
  | "LATER_THAN"
  | "NOT_LATER_THAN";    // <=

export interface TripReportTimeBidCommandInput extends BaseBidCommandInput {
  kind: "TRIP_REPORT_TIME";
  operator: TimeComparisonOperator;
  time: string; // "HH:MM" 24-hr, e.g. "07:30"
}

/**
 * Union of all UI-level command shapes.
 */
export type BidCommandInput =
  | DestinationBidCommandInput
  | TripLengthBidCommandInput
  | TripReportTimeBidCommandInput;

/**
 * Helper: only AWARD commands should carry a tripPool
 */
function resolveTripPool(verb: CommandKind, pool?: TripPool): TripPool | undefined {
  if (verb === "AWARD") return pool;
  return undefined;
}

/**
 * Convert a high-level BidCommandInput (UI model)
 * into a single TripPropertyCommand (engine model).
 *
 * This is where we encode the qualifier strings that tripMatching.ts expects:
 * - TRIP_LENGTH: "4D", "4-5D", ">= 4D", "<= 3D"
 * - TRIP_REPORT_TIME: "< 07:30", ">= 09:00"
 * - DESTINATION: raw text qualifier used as a substring.
 */
export function buildTripPropertyCommand(
  input: BidCommandInput,
  dateRange?: DateRange
): TripPropertyCommand {
  switch (input.kind) {
    case "DESTINATION": {
      const qualifier = input.destination.trim().toUpperCase();

      return {
        kind: input.verb,
        property: "DESTINATION",
        qualifier,
        dateRange,
        tripPool: resolveTripPool(input.verb, input.pool),
        limit: input.limit,
        note: input.note,
      };
    }

    case "TRIP_LENGTH_DAYS": {
      let qualifier: string;

      switch (input.operator) {
        case "EQUAL": {
          if (input.days == null) {
            throw new Error("TRIP_LENGTH_DAYS (EQUAL) requires 'days'");
          }
          qualifier = `${input.days}D`; // e.g. "4D"
          break;
        }
        case "AT_LEAST": {
          if (input.days == null) {
            throw new Error("TRIP_LENGTH_DAYS (AT_LEAST) requires 'days'");
          }
          qualifier = `>= ${input.days}D`; // e.g. ">= 4D"
          break;
        }
        case "AT_MOST": {
          if (input.days == null) {
            throw new Error("TRIP_LENGTH_DAYS (AT_MOST) requires 'days'");
          }
          qualifier = `<= ${input.days}D`; // e.g. "<= 3D"
          break;
        }
        case "BETWEEN": {
          if (input.minDays == null || input.maxDays == null) {
            throw new Error("TRIP_LENGTH_DAYS (BETWEEN) requires 'minDays' and 'maxDays'");
          }
          qualifier = `${input.minDays}-${input.maxDays}D`; // e.g. "4-5D"
          break;
        }
      }

      return {
        kind: input.verb,
        property: "TRIP_LENGTH",
        qualifier,
        dateRange,
        tripPool: resolveTripPool(input.verb, input.pool),
        limit: input.limit,
        note: input.note,
      };
    }

    case "TRIP_REPORT_TIME": {
      let op: string;

      switch (input.operator) {
        case "EARLIER_THAN":
          op = "<";
          break;
        case "NOT_EARLIER_THAN":
          op = ">=";
          break;
        case "LATER_THAN":
          op = ">";
          break;
        case "NOT_LATER_THAN":
          op = "<=";
          break;
      }

      const time = input.time.trim();
      const qualifier = `${op} ${time}`; // e.g. "< 07:30", ">= 09:00"

      return {
        kind: input.verb,
        property: "TRIP_REPORT_TIME",
        qualifier,
        dateRange,
        tripPool: resolveTripPool(input.verb, input.pool),
        limit: input.limit,
        note: input.note,
      };
    }

    default: {
      // Should not happen if BidCommandInput is kept in sync,
      // but this keeps runtime behaviour safe.
      throw new Error("Unsupported BidCommandInput kind");
    }
  }
}
