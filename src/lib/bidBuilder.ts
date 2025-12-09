// src/lib/bidBuilder.ts
import type { TripPropertyCommand } from "../rules/types";
import type { PreferenceProfile } from "../data/oliProfile";

// Very simple "V1" builder. Think of this as a stub for what BidNav does,
// but transparent and fully under our control.
export function buildSimpleBidGroup(
  profile: PreferenceProfile
): TripPropertyCommand[] {
  const commands: TripPropertyCommand[] = [];

  const [primaryDest, secondaryDest] = profile.preferredDestinations;
  const [avoidDest] = profile.avoidDestinations;

  // T01: strongest destination
  if (primaryDest) {
    commands.push({
      kind: "AWARD",
      property: "DESTINATION",
      qualifier: primaryDest,
      tripPool: "H++",
      note: `Max-strength for ${primaryDest}`,
    });
  }

  // T02: second destination
  if (secondaryDest) {
    commands.push({
      kind: "AWARD",
      property: "DESTINATION",
      qualifier: secondaryDest,
      tripPool: "H+",
      note: `Strong preference for ${secondaryDest}`,
    });
  }

  // T03: avoid destination (e.g. BOM)
  if (avoidDest) {
    commands.push({
      kind: "AVOID",
      property: "DESTINATION",
      qualifier: avoidDest,
      note: `Completely avoid ${avoidDest}`,
    });
  }

  // T04: prefer 4-day trips (placeholder encoding "4D")
  commands.push({
    kind: "AWARD",
    property: "TRIP_LENGTH",
    qualifier: "4D",
    tripPool: "H",
    note: "Prefer 4-day trips into high pool",
  });

  // T05: fallback – any 3-day trips
  commands.push({
    kind: "AWARD",
    property: "TRIP_LENGTH",
    qualifier: "3D",
    tripPool: "L",
    note: "Fallback: 3-day trips into low pool",
  });

  return commands;
}
