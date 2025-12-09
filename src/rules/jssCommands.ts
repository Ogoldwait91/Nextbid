// src/rules/jssCommands.ts
import type { TripPropertyCommand } from "./types";

// Turn a structured command into a JSS-style text line.
export function renderTripPropertyCommand(cmd: TripPropertyCommand): string {
  const parts: string[] = [];

  // 1. Command kind
  parts.push(cmd.kind); // "AWARD" / "AVOID"

  // 2. Trip property + qualifier (e.g. "DEST DXB")
  parts.push(propertyToText(cmd));

  // 3. Date range (very simple for now)
  if (cmd.dateRange && (cmd.dateRange.from || cmd.dateRange.to)) {
    const from = cmd.dateRange.from ?? "";
    const to = cmd.dateRange.to ?? "";
    parts.push(`${from}-${to}`);
  }

  // 4. Trip pool (AWARD only)
  if (cmd.kind === "AWARD" && cmd.tripPool) {
    parts.push(`[${cmd.tripPool}]`);
  }

  // 5. Limit (max times/roster)
  if (typeof cmd.limit === "number") {
    parts.push(`MAX ${cmd.limit}`);
  }

  return parts.join(" ").trim();
}

function propertyToText(cmd: TripPropertyCommand): string {
  const base = (() => {
    switch (cmd.property) {
      case "DESTINATION":
        return "DEST";
      case "TRIP_NUMBER":
        return "TRIP";
      case "TRIP_LENGTH":
        return "TLEN";
      case "CREDIT_TIME":
        return "CREDIT";
      case "BLOCK_TIME":
        return "BLOCK";
      case "LAYOVER_WITH_LENGTH":
        return "LAYOVER";
      case "ON_DUTY_WITHIN":
        return "ONDUTY";
      case "TRIP_START_TIME":
        return "TRIPSTART";
      case "TRIP_REPORT_TIME":
        return "REPORT";
      default:
        return cmd.property;
    }
  })();

  return cmd.qualifier ? `${base} ${cmd.qualifier}` : base;
}
