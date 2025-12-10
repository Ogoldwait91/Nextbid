// src/lib/bidBuilder.ts
import type { TripPropertyCommand } from "../rules/types";
import type { PreferenceProfile } from "../data/oliProfile";

type ScoredCommand = {
  command: TripPropertyCommand;
  score: number;
};

function describeTripLength(minDays: number, maxDays?: number): string {
  if (maxDays == null) return `${minDays} days or more`;
  if (minDays === maxDays) return `${minDays}-day trips`;
  return `${minDays}–${maxDays}-day trips`;
}

// Preference engine v1.
export function buildSimpleBidGroup(
  profile: PreferenceProfile,
  maxLines: number = 5
): TripPropertyCommand[] {
  const candidates: ScoredCommand[] = [];

  // 1) Destination preferences (primary + secondary)
  profile.preferredDestinations.forEach((dest, index) => {
    const baseScore = 100;
    const score = baseScore - index * 10;

    candidates.push({
      score,
      command: {
        kind: "AWARD",
        property: "DESTINATION",
        qualifier: dest,
        tripPool: index === 0 ? "H++" : "H+",
        note:
          index === 0
            ? `Primary destination preference for ${dest}`
            : `Secondary destination preference for ${dest}`,
      },
    });
  });

  // Avoid destinations – very high priority.
  profile.avoidDestinations.forEach((dest) => {
    candidates.push({
      score: 120,
      command: {
        kind: "AVOID",
        property: "DESTINATION",
        qualifier: dest,
        note: `Completely avoid ${dest}`,
      },
    });
  });

  // 2) Trip length preference (new model)
  if (profile.tripLengthPreference) {
    const { mode, minDays, maxDays } = profile.tripLengthPreference;

    let qualifier: string;
    if (maxDays == null) {
      qualifier = `>= ${minDays}D`;
    } else if (minDays === maxDays) {
      qualifier = `${minDays}D`;
    } else {
      qualifier = `${minDays}-${maxDays}D`;
    }

    const notePrefix = mode === "AWARD" ? "Prefer" : "Avoid";

    candidates.push({
      score: 80,
      command: {
        kind: mode,
        property: "TRIP_LENGTH",
        qualifier,
        tripPool: mode === "AWARD" ? "H" : undefined,
        note: `${notePrefix} ${describeTripLength(minDays, maxDays)}`,
      },
    });
  } else if (profile.preferLongTrips) {
    // Legacy fallback: prefer 4D with 3D fallback.
    candidates.push({
      score: 80,
      command: {
        kind: "AWARD",
        property: "TRIP_LENGTH",
        qualifier: "4D",
        tripPool: "H",
        note: "Prefer 4-day trips into high pool",
      },
    });

    candidates.push({
      score: 60,
      command: {
        kind: "AWARD",
        property: "TRIP_LENGTH",
        qualifier: "3D",
        tripPool: "L",
        note: "Fallback: 3-day trips into low pool",
      },
    });
  }

  // 3) Long layover preference
  if (profile.preferLongLayovers) {
    candidates.push({
      score: 70,
      command: {
        kind: "AWARD",
        property: "LAYOVER_WITH_LENGTH",
        qualifier: ">= 36:00",
        note: "Prefer trips with long layovers (36h+ estimate)",
      },
    });
  }

  // 4) Reserve avoidance – placeholder via low-credit avoidance.
  if (profile.reserveAvoidanceLevel === "HATE") {
    candidates.push({
      score: 90,
      command: {
        kind: "AVOID",
        property: "CREDIT_TIME",
        qualifier: "< 12:00",
        note: "Avoid very low-credit trips to reduce reserve risk (placeholder)",
      },
    });
  }

  // 5) Early/late report times
  if (profile.earliestPreferredReportTime) {
    candidates.push({
      score: 85,
      command: {
        kind: "AVOID",
        property: "TRIP_REPORT_TIME",
        qualifier: `< ${profile.earliestPreferredReportTime}`,
        note: `Avoid report times earlier than ${profile.earliestPreferredReportTime} (lifestyle/fatigue preference)`,
      },
    });
  }

  if (profile.latestPreferredReportTime) {
    candidates.push({
      score: 75,
      command: {
        kind: "AVOID",
        property: "TRIP_REPORT_TIME",
        qualifier: `> ${profile.latestPreferredReportTime}`,
        note: `Avoid report times later than ${profile.latestPreferredReportTime}`,
      },
    });
  }

  // --- Deduplicate and sort by score ---
  candidates.sort((a, b) => b.score - a.score);

  const uniqueMap = new Map<string, ScoredCommand>();

  for (const cand of candidates) {
    const key = JSON.stringify({
      kind: cand.command.kind,
      property: cand.command.property,
      qualifier: cand.command.qualifier,
      tripPool: cand.command.tripPool ?? null,
    });

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, cand);
    }
  }

  const uniqueSorted = Array.from(uniqueMap.values());

  return uniqueSorted.slice(0, maxLines).map((c) => c.command);
}
