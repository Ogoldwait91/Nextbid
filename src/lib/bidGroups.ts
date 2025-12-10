// src/lib/bidGroups.ts

import type { Trip } from "../data/sampleTrips";
import type { TripPropertyCommand, DateRange } from "../rules/types";
import {
  buildTripPropertyCommand,
  type BidCommandInput,
} from "./bidCommandBuilder";
import { getTripsAffectedByCommand } from "./tripMatching";

/**
 * Represents a single Bid Group (JSS-style):
 * - rank: 1–15 (Group 1, Group 2, etc.)
 * - isFinalFallback: true if this is the "last resort" group
 * - commands: ordered list of bid commands in that group
 */
export interface BidGroup {
  id: string;
  name: string;
  rank: number; // 1 = first group tried by JCR
  isFinalFallback?: boolean;
  commands: BidCommandInput[];
  note?: string;
}

/**
 * Convert a BidGroup (UI-level commands) into engine-level TripPropertyCommands
 * that the matcher understands.
 */
export function buildTripPropertyCommandsForGroup(
  group: BidGroup,
  dateRange?: DateRange
): TripPropertyCommand[] {
  return group.commands.map((cmd) =>
    buildTripPropertyCommand(cmd, dateRange)
  );
}

/**
 * For a given group and a set of trips, show:
 * - each command
 * - its engine representation
 * - which trips it affects
 *
 * This is a "preview" helper, not full JCR logic.
 */
export interface BidGroupPreview {
  group: BidGroup;
  commands: {
    input: BidCommandInput;
    engineCommand: TripPropertyCommand;
    matchedTrips: Trip[];
  }[];
}

export function previewBidGroupOnTrips(
  group: BidGroup,
  trips: Trip[],
  dateRange?: DateRange
): BidGroupPreview {
  const engineCommands = buildTripPropertyCommandsForGroup(group, dateRange);

  const commandSummaries = engineCommands.map((engineCommand, index) => {
    const input = group.commands[index];
    const matchedTrips = getTripsAffectedByCommand(engineCommand, trips);

    return {
      input,
      engineCommand,
      matchedTrips,
    };
  });

  return {
    group,
    commands: commandSummaries,
  };
}

/**
 * Example "777 ideal month" group using your current sample trips.
 * This is just a demo to sanity-check the flow.
 */
export const demo777IdealGroup: BidGroup = {
  id: "demo-777-ideal",
  name: "Group 1 – Ideal 777 month",
  rank: 1,
  isFinalFallback: false,
  commands: [
    // 1) Prefer 4-day trips into H+
    {
      kind: "TRIP_LENGTH_DAYS",
      verb: "AWARD",
      operator: "EQUAL",
      days: 4,
      pool: "H+",
      limit: 3,
      note: "Prefer 4-day trips (up to 3) into H+",
    },
    // 2) Strongly prefer MLE into H++
    {
      kind: "DESTINATION",
      verb: "AWARD",
      destination: "MLE",
      pool: "H++",
      limit: 2,
      note: "Top priority MLE trips into H++",
    },
    // 3) Avoid very early reports
    {
      kind: "TRIP_REPORT_TIME",
      verb: "AVOID",
      operator: "EARLIER_THAN",
      time: "07:00",
      note: "Avoid ultra-early reports before 07:00",
    },
  ],
};
