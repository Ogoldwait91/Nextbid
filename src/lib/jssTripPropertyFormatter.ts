// src/lib/jssTripPropertyFormatter.ts

import type {
  BidCommandInput,
  TripLengthOperator,
  TimeComparisonOperator,
} from "./bidCommandBuilder";

/**
 * Format a BidCommandInput into a JSS Trip Property bid string.
 *
 * NOTE: v1 supports only the kinds we currently build:
 * - DESTINATION
 * - TRIP_LENGTH_DAYS
 * - TRIP_REPORT_TIME
 *
 * You should verify and tweak the exact syntax against the JSS docs.
 */
export function formatBidCommandInputToJss(
  cmd: BidCommandInput,
  groupNumber: number
): string {
  const grp = groupNumber.toString().padStart(2, "0");

  switch (cmd.kind) {
    case "DESTINATION":
      return formatDestinationCommand(cmd, grp);

    case "TRIP_LENGTH_DAYS":
      return formatTripLengthDaysCommand(cmd, grp);

        case "TRIP_REPORT_TIME":
      return formatTripReportTimeCommand(cmd, grp);

    default:
      // Fallback: show JSON for now so we notice unsupported kinds
      return `G${grp} /* TODO: format command */ ${JSON.stringify(cmd)}`;
  }
}


function formatDestinationCommand(
  cmd: Extract<BidCommandInput, { kind: "DESTINATION" }>,
  grp: string
): string {
  const parts: string[] = [
    `G${grp}`,
    cmd.verb,            // AWARD or AVOID
    "DESTINATION",
    cmd.destination!,    // e.g. "MLE"
  ];

  if (cmd.pool) {
    parts.push("POOL", cmd.pool);
  }

  if (cmd.limit !== undefined) {
    parts.push("LIMIT", cmd.limit.toString());
  }

  return parts.join(" ");
}

function formatTripLengthDaysCommand(
  cmd: Extract<BidCommandInput, { kind: "TRIP_LENGTH_DAYS" }>,
  grp: string
): string {
  const parts: string[] = [
    `G${grp}`,
    cmd.verb,
    "TRIP_LENGTH_DAYS",
  ];

  if (cmd.operator === "BETWEEN") {
    // BETWEEN min max
    if (cmd.minDays !== undefined && cmd.maxDays !== undefined) {
      parts.push(
        "BETWEEN",
        cmd.minDays.toString(),
        cmd.maxDays.toString()
      );
    }
  } else if (cmd.days !== undefined) {
    const opSymbol = lengthOperatorToSymbol(cmd.operator);
    parts.push(opSymbol, cmd.days.toString());
  }

  if (cmd.pool) {
    parts.push("POOL", cmd.pool);
  }

  if (cmd.limit !== undefined) {
    parts.push("LIMIT", cmd.limit.toString());
  }

  return parts.join(" ");
}

function formatTripReportTimeCommand(
  cmd: Extract<BidCommandInput, { kind: "TRIP_REPORT_TIME" }>,
  grp: string
): string {
  const parts: string[] = [
    `G${grp}`,
    cmd.verb,
    "REPORT_TIME",
    timeOperatorToSymbol(cmd.operator),
    cmd.time!, // e.g. "07:30"
  ];

  if (cmd.pool) {
    parts.push("POOL", cmd.pool);
  }

  if (cmd.limit !== undefined) {
    parts.push("LIMIT", cmd.limit.toString());
  }

  return parts.join(" ");
}

/**
 * Helpers to translate our internal operators to JSS-style symbols.
 * Adjust if your JSS syntax is different.
 */
function lengthOperatorToSymbol(op: TripLengthOperator): string {
  switch (op) {
    case "EQUAL":
      return "=";
    case "AT_LEAST":
      return ">=";
    case "AT_MOST":
      return "<=";
    case "BETWEEN":
      return "BETWEEN"; // handled separately
    default:
      return "=";
  }
}

function timeOperatorToSymbol(op: TimeComparisonOperator): string {
  switch (op) {
    case "EARLIER_THAN":
      return "<";
    case "NOT_EARLIER_THAN":
      return ">=";
    case "LATER_THAN":
      return ">";
    case "NOT_LATER_THAN":
      return "<=";
    default:
      return "<";
  }
}
