"use client";

import { useState } from "react";
import { sampleTrips } from "../../data/sampleTrips";
import {
  oliProfile as baseProfile,
  type PreferenceProfile,
} from "../../data/oliProfile";
import { buildSimpleBidGroup } from "../../lib/bidBuilder";
import { renderTripPropertyCommand } from "../../rules/jssCommands";
import { getTripsAffectedByCommand } from "../../lib/tripMatching";
import type { TripPropertyCommand } from "../../rules/types";

type GeneratedBidLine = {
  lineNumber: number;
  strength: 1 | 2 | 3 | 4 | 5;
  command: TripPropertyCommand;
};

type TripLengthPreset = "3D" | "4D" | "4-5D" | "6D+";

export default function DashboardClient() {
  const [preferLongLayovers, setPreferLongLayovers] = useState(
    baseProfile.preferLongLayovers
  );
  const [avoidBom, setAvoidBom] = useState(
    baseProfile.avoidDestinations.includes("BOM")
  );

  // Earliest / latest report controls
  const [limitEarliest, setLimitEarliest] = useState<boolean>(
    !!baseProfile.earliestPreferredReportTime
  );
  const [limitLatest, setLimitLatest] = useState<boolean>(
    !!baseProfile.latestPreferredReportTime
  );
  const [earliestReport, setEarliestReport] = useState<string>(
    baseProfile.earliestPreferredReportTime ?? "07:00"
  );
  const [latestReport, setLatestReport] = useState<string>(
    baseProfile.latestPreferredReportTime ?? "22:00"
  );

  // Trip length rule controls
  const [tripLengthEnabled, setTripLengthEnabled] = useState<boolean>(
    !!baseProfile.tripLengthPreference
  );
  const [tripLengthMode, setTripLengthMode] = useState<"AWARD" | "AVOID">(
    baseProfile.tripLengthPreference?.mode ?? "AWARD"
  );
  const [tripLengthPreset, setTripLengthPreset] = useState<TripLengthPreset>(
    (() => {
      const tl = baseProfile.tripLengthPreference;
      if (!tl) return "4-5D";
      if (tl.minDays === 3 && tl.maxDays === 3) return "3D";
      if (tl.minDays === 4 && tl.maxDays === 4) return "4D";
      if (tl.minDays === 4 && tl.maxDays === 5) return "4-5D";
      if (tl.minDays === 6 && tl.maxDays == null) return "6D+";
      return "4-5D";
    })()
  );

  // Map preset to min/max days for the profile
  function mapPresetToRange(
    preset: TripLengthPreset
  ): { minDays: number; maxDays?: number } {
    switch (preset) {
      case "3D":
        return { minDays: 3, maxDays: 3 };
      case "4D":
        return { minDays: 4, maxDays: 4 };
      case "4-5D":
        return { minDays: 4, maxDays: 5 };
      case "6D+":
        return { minDays: 6, maxDays: undefined };
      default:
        return { minDays: 4, maxDays: 5 };
    }
  }

  const tripLengthRange = mapPresetToRange(tripLengthPreset);

  // Build an "effective" profile from base + UI controls
  const profile: PreferenceProfile = {
    ...baseProfile,
    preferLongLayovers,
    avoidDestinations: avoidBom ? baseProfile.avoidDestinations : [],
    earliestPreferredReportTime: limitEarliest ? earliestReport : undefined,
    latestPreferredReportTime: limitLatest ? latestReport : undefined,
    tripLengthPreference: tripLengthEnabled
      ? {
          mode: tripLengthMode,
          minDays: tripLengthRange.minDays,
          maxDays: tripLengthRange.maxDays,
        }
      : undefined,
  };

  const generatedBidGroup = buildSimpleBidGroup(profile, 5);

  const generatedBidLines: GeneratedBidLine[] = generatedBidGroup.map(
    (cmd, index) => {
      let strength: 1 | 2 | 3 | 4 | 5 = 3;
      if (index === 0) strength = 5;
      else if (index === 1 || index === 2) strength = 4;

      return {
        lineNumber: index + 1,
        strength,
        command: cmd,
      };
    }
  );

  const totalTrips = sampleTrips.length;
  const tripsTargeted = new Set<string>();
  generatedBidLines.forEach((line) => {
    getTripsAffectedByCommand(line.command, sampleTrips).forEach((trip) =>
      tripsTargeted.add(trip.tripNumber)
    );
  });

  const primaryDest = profile.preferredDestinations[0] ?? "—";
  const secondaryDest = profile.preferredDestinations[1] ?? "—";
  const avoidDest = profile.avoidDestinations[0] ?? "—";

  const exportBlock = generatedBidLines
    .map((line) => {
      const tNumber = line.lineNumber.toString().padStart(2, "0");
      const cmdText = renderTripPropertyCommand(line.command);
      return `T${tNumber} S${line.strength} ${cmdText}`;
    })
    .join("\n");

  return (
    <div className="space-y-8">
      {/* Top row: overview + live preference controls */}
      <section className="grid gap-4 lg:grid-cols-[2fr,1.3fr]">
        {/* Overview cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-sky-950 via-slate-950 to-slate-950 p-4">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-sky-400 uppercase mb-2">
              Focus Destinations
            </p>
            <p className="text-sm text-slate-200 mb-1">
              Primary:{" "}
              <span className="font-mono text-sky-300">{primaryDest}</span>
            </p>
            <p className="text-sm text-slate-200">
              Secondary:{" "}
              <span className="font-mono text-sky-300">{secondaryDest}</span>
            </p>
            <p className="mt-3 text-[11px] text-slate-400">
              Avoiding:{" "}
              <span className="font-mono text-rose-300">{avoidDest}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-sky-400 uppercase mb-2">
              Trip Coverage
            </p>
            <p className="text-2xl font-semibold text-slate-50">
              {tripsTargeted.size}
              <span className="text-base text-slate-400">
                {" "}
                / {totalTrips} trips
              </span>
            </p>
            <p className="mt-2 text-[12px] text-slate-400">
              Current bidlines directly target these sample January 26 trips.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-sky-400 uppercase mb-2">
              Profile
            </p>
            <p className="text-sm text-slate-200">
              {profile.name} · {profile.fleet} {profile.seat}
            </p>
            <p className="text-[12px] text-slate-400 mt-1">
              Seniority:{" "}
              <span className="font-mono text-sky-300">
                #{profile.seniorityNumber}
              </span>
            </p>
            <p className="mt-3 text-[12px] text-slate-400">
              Reserve avoidance:{" "}
              <span className="uppercase">
                {profile.reserveAvoidanceLevel}
              </span>
            </p>
          </div>
        </div>

        {/* Live preference knobs (demo) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-sky-400 uppercase">
            Preferences · Demo controls
          </p>
          <p className="text-[12px] text-slate-400">
            Adjust these and watch the bidlines and trip focus update in real
            time. Later this becomes a full preference editor.
          </p>

          <div className="space-y-2 mt-2">
            <TripLengthRow
              enabled={tripLengthEnabled}
              mode={tripLengthMode}
              preset={tripLengthPreset}
              onToggleEnabled={() => setTripLengthEnabled((v) => !v)}
              onModeChange={setTripLengthMode}
              onPresetChange={setTripLengthPreset}
            />

            <ToggleRow
              label="Prefer long layovers"
              description="Award trips with estimated layovers of 36h or more."
              active={preferLongLayovers}
              onToggle={() => setPreferLongLayovers((v) => !v)}
            />

            <ToggleRow
              label="Avoid BOM completely"
              description="Turn BOM avoidance on or off to see how the lines reshuffle."
              active={avoidBom}
              onToggle={() => setAvoidBom((v) => !v)}
            />

            <TimeLimitRow
              label="Limit earliest report time"
              description="Avoid trips that report too early for your preference."
              active={limitEarliest}
              time={earliestReport}
              onToggle={() => setLimitEarliest((v) => !v)}
              onTimeChange={setEarliestReport}
            />

            <TimeLimitRow
              label="Limit latest report time"
              description="Avoid trips that report later than you want to start your day."
              active={limitLatest}
              time={latestReport}
              onToggle={() => setLimitLatest((v) => !v)}
              onTimeChange={setLatestReport}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Bidlines preview */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-sky-200">
                Bidlines Preview (T01–T05)
              </h2>
              <p className="text-[11px] text-slate-400">
                Generated from your current preference profile.
              </p>
            </div>
            <span className="text-[11px] text-slate-500">
              Demo · Jan 26 · 777 FO
            </span>
          </div>

          <div className="space-y-2 text-xs bg-slate-950/70 border border-slate-800 rounded-xl p-3 font-mono">
            {generatedBidLines.map((line) => {
              const tNumber = line.lineNumber.toString().padStart(2, "0");
              const affectedTrips = getTripsAffectedByCommand(
                line.command,
                sampleTrips
              );

              return (
                <div key={tNumber} className="space-y-1">
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col items-center justify-center min-w-[3.2rem]">
                      <span className="text-slate-400 text-[11px]">
                        T{tNumber}
                      </span>
                      <span className="text-[10px] text-sky-300">
                        S{line.strength}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-100">
                        {renderTripPropertyCommand(line.command)}
                      </div>
                      {line.command.note && (
                        <div className="text-[11px] text-slate-400">
                          {"// "}{line.command.note}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pl-[3.2rem] text-[11px] text-slate-500">
                    {affectedTrips.length > 0 ? (
                      <span>
                        Targets:{" "}
                        {affectedTrips
                          .map(
                            (trip) =>
                              `${trip.tripNumber} · ${
                                trip.route.split("(")[0].trim()
                              }`
                          )
                          .join(", ")}
                      </span>
                    ) : (
                      <span>Targets: none of the sample trips (yet)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <p className="text-[11px] text-slate-400 uppercase mb-1">
              Export block (draft format)
            </p>
            <pre className="text-[11px] bg-slate-950/70 border border-slate-800 rounded-xl p-3 overflow-x-auto font-mono">
              {exportBlock}
            </pre>
          </div>
        </div>

        {/* Trips targeted */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-sky-200">
                Trips in Focus (Jan 26)
              </h2>
              <p className="text-[11px] text-slate-400">
                How your current bidlines interact with these sample trips.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {sampleTrips.map((trip) => {
              const targetingLines = generatedBidLines.filter((line) =>
                getTripsAffectedByCommand(line.command, [trip]).length > 0
              );

              return (
                <div
                  key={trip.tripNumber}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 text-[11px] font-mono">
                        {trip.tripNumber}
                      </span>
                      <span className="text-slate-100">
                        {trip.route.split("(")[0].trim()}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {trip.tripDays}D · {trip.tripCredit}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                      TAFB {trip.tafb}
                    </span>
                    {typeof trip.layoverHoursEstimate === "number" && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                        Layover ~{trip.layoverHoursEstimate}h
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    {targetingLines.length > 0 ? (
                      <span>
                        Influenced by:{" "}
                        {targetingLines
                          .map(
                            (line) =>
                              `T${line.lineNumber
                                .toString()
                                .padStart(2, "0")} (S${line.strength})`
                          )
                          .join(", ")}
                      </span>
                    ) : (
                      <span>Not directly targeted by current bidlines.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

type ToggleRowProps = {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
};

function ToggleRow({ label, description, active, onToggle }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
        active
          ? "border-sky-600 bg-sky-950/60"
          : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
      }`}
    >
      <div>
        <p className="text-[13px] text-slate-100">{label}</p>
        <p className="text-[11px] text-slate-400">{description}</p>
      </div>
      <div
        className={`relative inline-flex h-5 w-9 items-center rounded-full border ${
          active
            ? "bg-sky-500/80 border-sky-300"
            : "bg-slate-800 border-slate-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
            active ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );
}

type TimeLimitRowProps = {
  label: string;
  description: string;
  active: boolean;
  time: string;
  onToggle: () => void;
  onTimeChange: (value: string) => void;
};

function TimeLimitRow({
  label,
  description,
  active,
  time,
  onToggle,
  onTimeChange,
}: TimeLimitRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950/40">
      <div className="flex-1">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2"
        >
          <div
            className={`relative inline-flex h-5 w-9 items-center rounded-full border ${
              active
                ? "bg-sky-500/80 border-sky-300"
                : "bg-slate-800 border-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                active ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
          <div className="text-left">
            <p className="text-[13px] text-slate-100">{label}</p>
            <p className="text-[11px] text-slate-400">{description}</p>
          </div>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className={`text-[11px] rounded-lg border px-2 py-1 bg-slate-950 ${
            active
              ? "border-sky-500 text-sky-100"
              : "border-slate-700 text-slate-400"
          }`}
        />
      </div>
    </div>
  );
}

type TripLengthRowProps = {
  enabled: boolean;
  mode: "AWARD" | "AVOID";
  preset: TripLengthPreset;
  onToggleEnabled: () => void;
  onModeChange: (mode: "AWARD" | "AVOID") => void;
  onPresetChange: (preset: TripLengthPreset) => void;
};

function TripLengthRow({
  enabled,
  mode,
  preset,
  onToggleEnabled,
  onModeChange,
  onPresetChange,
}: TripLengthRowProps) {
  const presets: { value: TripLengthPreset; label: string }[] = [
    { value: "3D", label: "3-day trips" },
    { value: "4D", label: "4-day trips" },
    { value: "4-5D", label: "4–5 days" },
    { value: "6D+", label: "6 days or more" },
  ];

  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onToggleEnabled}
          className="flex items-center gap-2"
        >
          <div
            className={`relative inline-flex h-5 w-9 items-center rounded-full border ${
              enabled
                ? "bg-sky-500/80 border-sky-300"
                : "bg-slate-800 border-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                enabled ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
          <div className="text-left">
            <p className="text-[13px] text-slate-100">Trip length rule</p>
            <p className="text-[11px] text-slate-400">
              Award or avoid specific trip lengths.
            </p>
          </div>
        </button>
        <div className="flex rounded-full border border-slate-700 bg-slate-900 overflow-hidden text-[11px]">
          <button
            type="button"
            onClick={() => onModeChange("AWARD")}
            className={`px-3 py-1 ${
              mode === "AWARD"
                ? "bg-sky-600 text-slate-50"
                : "text-slate-300"
            }`}
          >
            Award
          </button>
          <button
            type="button"
            onClick={() => onModeChange("AVOID")}
            className={`px-3 py-1 ${
              mode === "AVOID"
                ? "bg-rose-600 text-slate-50"
                : "text-slate-300"
            }`}
          >
            Avoid
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => {
          const active = preset === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onPresetChange(p.value)}
              className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${
                active
                  ? "border-sky-500 bg-sky-950 text-sky-200"
                  : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
              } ${!enabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!enabled}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
