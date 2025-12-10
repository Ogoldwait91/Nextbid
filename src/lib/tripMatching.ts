// src/lib/tripMatching.ts
import type { Trip } from "../data/sampleTrips";
import type { TripPropertyCommand } from "../rules/types";

function parseHoursMinutesToMinutes(value: string): number | null {
  const match = value.match(/^(\d{1,3}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const mins = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(mins)) return null;
  return hours * 60 + mins;
}

export function getTripsAffectedByCommand(
  cmd: TripPropertyCommand,
  trips: Trip[]
): Trip[] {
  switch (cmd.property) {
    case "DESTINATION": {
      if (!cmd.qualifier) return [];
      const qual = cmd.qualifier.toUpperCase();
      return trips.filter((trip) =>
        trip.route.toUpperCase().includes(qual)
      );
    }

    case "TRIP_LENGTH": {
      if (!cmd.qualifier) return [];
      const q = cmd.qualifier.trim();

      // Match "4D"
      const exactMatch = q.match(/^(\d+)D$/);
      if (exactMatch) {
        const days = Number(exactMatch[1]);
        return trips.filter((trip) => trip.tripDays === days);
      }

      // Match "4-5D"
      const rangeMatch = q.match(/^(\d+)-(\d+)D$/);
      if (rangeMatch) {
        const min = Number(rangeMatch[1]);
        const max = Number(rangeMatch[2]);
        return trips.filter(
          (trip) => trip.tripDays >= min && trip.tripDays <= max
        );
      }

      // Match ">= 4D" or ">=4D"
      const geMatch = q.match(/^>=\s*(\d+)D$/);
      if (geMatch) {
        const min = Number(geMatch[1]);
        return trips.filter((trip) => trip.tripDays >= min);
      }

      // Match "<= 3D" or "<=3D"
      const leMatch = q.match(/^<=\s*(\d+)D$/);
      if (leMatch) {
        const max = Number(leMatch[1]);
        return trips.filter((trip) => trip.tripDays <= max);
      }

      return [];
    }

    case "CREDIT_TIME": {
      if (!cmd.qualifier) return [];
      const match = cmd.qualifier.match(/([<>]=?)\s*(\d{1,3}:\d{2})/);
      if (!match) return [];
      const op = match[1];
      const limitMinutes = parseHoursMinutesToMinutes(match[2]);
      if (limitMinutes == null) return [];

      return trips.filter((trip) => {
        const creditMinutes = parseHoursMinutesToMinutes(trip.tripCredit);
        if (creditMinutes == null) return false;

        switch (op) {
          case "<":
            return creditMinutes < limitMinutes;
          case "<=":
            return creditMinutes <= limitMinutes;
          case ">":
            return creditMinutes > limitMinutes;
          case ">=":
            return creditMinutes >= limitMinutes;
          default:
            return false;
        }
      });
    }

    case "LAYOVER_WITH_LENGTH": {
      if (!cmd.qualifier) return [];
      const match = cmd.qualifier.match(/([<>]=?)\s*(\d{1,3})(?::(\d{2}))?/);
      if (!match) return [];
      const op = match[1];
      const hours = Number(match[2]);
      const mins = match[3] ? Number(match[3]) : 0;
      if (Number.isNaN(hours) || Number.isNaN(mins)) return [];

      const limitMinutes = hours * 60 + mins;

      return trips.filter((trip) => {
        if (typeof trip.layoverHoursEstimate !== "number") return false;
        const layoverMinutes = trip.layoverHoursEstimate * 60;

        switch (op) {
          case "<":
            return layoverMinutes < limitMinutes;
          case "<=":
            return layoverMinutes <= limitMinutes;
          case ">":
            return layoverMinutes > limitMinutes;
          case ">=":
            return layoverMinutes >= limitMinutes;
          default:
            return false;
        }
      });
    }

    case "TRIP_REPORT_TIME": {
      if (!cmd.qualifier) return [];
      const match = cmd.qualifier.match(/([<>]=?)\s*(\d{1,2}:\d{2})/);
      if (!match) return [];
      const op = match[1];
      const limitMinutes = parseHoursMinutesToMinutes(match[2]);
      if (limitMinutes == null) return [];

      return trips.filter((trip) => {
        if (!trip.reportTimeLocal) return false;
        const reportMinutes = parseHoursMinutesToMinutes(
          trip.reportTimeLocal
        );
        if (reportMinutes == null) return false;

        switch (op) {
          case "<":
            return reportMinutes < limitMinutes;
          case "<=":
            return reportMinutes <= limitMinutes;
          case ">":
            return reportMinutes > limitMinutes;
          case ">=":
            return reportMinutes >= limitMinutes;
          default:
            return false;
        }
      });
    }

    default:
      return [];
  }
}
