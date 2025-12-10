// src/data/sampleTrips.ts

export type Trip = {
  tripNumber: string;
  route: string;
  departureBase: string;
  planningPeriod: string;
  tafb: string; // Time Away From Base
  tripCredit: string;
  tripDays: number;
  flyingHours: string;
  dutyHours: string;
  // Rough layover length estimate in hours (for matching long layovers).
  layoverHoursEstimate?: number;
};

export const sampleTrips: Trip[] = [
  {
    tripNumber: "7024",
    route: "LHR – MLE – LHR (BA061/060)",
    departureBase: "LHR",
    planningPeriod: "Jan 2026",
    tafb: "73:50",
    tripCredit: "21:50",
    tripDays: 4,
    flyingHours: "21:50",
    dutyHours: "25:40",
    layoverHoursEstimate: 48, // long-ish MLE layover (placeholder)
  },
  {
    tripNumber: "7202",
    route: "LHR – LAX – LHR (BA283/282)",
    departureBase: "LHR",
    planningPeriod: "Jan 2026",
    tafb: "73:55",
    tripCredit: "21:55",
    tripDays: 4,
    flyingHours: "21:55",
    dutyHours: "25:40",
    layoverHoursEstimate: 44, // long LAX layover (placeholder)
  },
  {
    tripNumber: "7174",
    route: "LHR – JFK – LHR (BA173/176)",
    departureBase: "LHR",
    planningPeriod: "Jan 2026",
    tafb: "45:50",
    tripCredit: "15:00",
    tripDays: 3,
    flyingHours: "15:00",
    dutyHours: "18:45",
    layoverHoursEstimate: 24, // shorter JFK layover (placeholder)
  },
];
