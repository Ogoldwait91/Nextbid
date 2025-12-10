// src/lib/preferences.ts

import type { TripPool } from "../rules/types";
import type { BidGroup } from "./bidGroups";
import type {
  BidCommandInput,
  TripLengthOperator,
} from "./bidCommandBuilder";

/**
 * How the pilot expresses what they want in plain language.
 */
export type TripLengthPreference = "mostly_short" | "balanced" | "mostly_long";

export interface DestinationPreference {
  code: string;           // e.g. "MLE"
  priority: TripPool;     // which pool to award it into, e.g. "H++"
  maxPerMonth?: number;   // optional cap
}

export interface ReportTimePreference {
  avoidVeryEarly: boolean;
  earliestPreferredReport?: string; // "HH:MM"
}

export interface BankProtectionPreference {
  enabled: boolean;
}

export interface Preferences {
  tripLength: TripLengthPreference;
  preferredDestinations: DestinationPreference[];
  reportTime: ReportTimePreference;
  bankProtection: BankProtectionPreference;
}

/**
 * Helper to create a default preferences object for 777 pilots.
 */
export function defaultPreferences777(): Preferences {
  return {
    tripLength: "balanced",
    preferredDestinations: [],
    reportTime: {
      avoidVeryEarly: true,
      earliestPreferredReport: "07:30",
    },
    bankProtection: {
      enabled: true,
    },
  };
}

/**
 * Convert high-level Preferences into a set of BidGroups.
 * v1: just 2 groups:
 *   - Group 1: Ideal month (length + destination + report-time avoid)
 *   - Final group: Bank protect only (if enabled)
 */
export function buildBidGroupsFromPreferences(
  prefs: Preferences
): BidGroup[] {
  const groups: BidGroup[] = [];

  // --- Group 1: Ideal month ---
  const group1Commands: BidCommandInput[] = [];

  // 1) Trip length preference
  const tripLengthCmd = buildTripLengthCommandFromPreference(prefs.tripLength);
  if (tripLengthCmd) {
    group1Commands.push(tripLengthCmd);
  }

  // 2) Destination preferences
  prefs.preferredDestinations.forEach((destPref) => {
    const cmd: BidCommandInput = {
      kind: "DESTINATION",
      verb: "AWARD",
      destination: destPref.code,
      pool: destPref.priority,
      limit: destPref.maxPerMonth,
      note: `Prefer ${destPref.code} into ${destPref.priority}`,
    };
    group1Commands.push(cmd);
  });

  // 3) Report time preference
  const reportTimeCmd = buildReportTimeCommandFromPreference(prefs.reportTime);
  if (reportTimeCmd) {
    group1Commands.push(reportTimeCmd);
  }

  groups.push({
    id: "prefs-group-1",
    name: "Group 1 – Ideal month (from preferences)",
    rank: 1,
    isFinalFallback: false,
    commands: group1Commands,
  });

  // --- Final group: bank protection (if enabled) ---
  if (prefs.bankProtection.enabled) {
    const bankProtectGroup: BidGroup = {
      id: "prefs-bank-protect",
      name: "Final group – Bank protection only",
      rank: 99,
      isFinalFallback: true,
      commands: [
        {
          kind: "DESTINATION",
          verb: "AWARD",
          destination: "L--",
          pool: "L--",
          note: "TODO: Replace with proper WORK_CONTAINED_WITHIN L-- pattern",
        },
      ],
    };

    groups.push(bankProtectGroup);
  }

  return groups;
}

/**
 * Internal helpers
 */

function buildTripLengthCommandFromPreference(
  pref: TripLengthPreference
): BidCommandInput | null {
  let operator: TripLengthOperator = "EQUAL";
  let days: number | undefined;
  let minDays: number | undefined;
  let maxDays: number | undefined;
  let pool: TripPool = "H";
  let limit: number | undefined;
  let note: string;

  switch (pref) {
    case "mostly_short":
      operator = "EQUAL";
      days = 3;
      pool = "H";
      limit = 4;
      note = "Prefer mostly 3-day trips (up to 4)";
      break;

    case "balanced":
      operator = "BETWEEN";
      minDays = 3;
      maxDays = 4;
      pool = "N";
      limit = undefined;
      note = "Balanced mix of 3- and 4-day trips";
      break;

    case "mostly_long":
      operator = "EQUAL";
      days = 4;
      pool = "H+";
      limit = 4;
      note = "Prefer mostly 4-day trips (up to 4)";
      break;
  }

  if (operator === "BETWEEN") {
    return {
      kind: "TRIP_LENGTH_DAYS",
      verb: "AWARD",
      operator,
      minDays,
      maxDays,
      pool,
      limit,
      note,
    };
  }

  return {
    kind: "TRIP_LENGTH_DAYS",
    verb: "AWARD",
    operator,
    days,
    pool,
    limit,
    note,
  };
}

function buildReportTimeCommandFromPreference(
  pref: ReportTimePreference
): BidCommandInput | null {
  if (!pref.avoidVeryEarly || !pref.earliestPreferredReport) {
    return null;
  }

  return {
    kind: "TRIP_REPORT_TIME",
    verb: "AVOID",
    operator: "EARLIER_THAN",
    time: pref.earliestPreferredReport,
    note: `Avoid reports earlier than ${pref.earliestPreferredReport}`,
  };
}
