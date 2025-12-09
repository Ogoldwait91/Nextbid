// src/data/sampleTrips.ts

export type Trip = {
  tripNumber: string;
  route: string;
  departureBase: string;
  planningPeriod: string;
  tafb: string;       // Time Away From Base
  tripCredit: string; // credit hours as shown in JSSTRIPS
  tripDays: number;
  flyingHours: string;
  dutyHours: string;
};

// NOTE: These are example values – you can edit them to match
// your real JSSTRIPS report for JAN 26.
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
  },
];
