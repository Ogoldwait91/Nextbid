"use client";

import { useState } from "react";
import type { Trip } from "../../data/sampleTrips";
import { sampleTrips } from "../../data/sampleTrips";
import {
  buildTripPropertyCommand,
  type BidCommandInput,
  type BidCommandKind,
  type TripLengthOperator,
  type TimeComparisonOperator,
} from "../../lib/bidCommandBuilder";
import { getTripsAffectedByCommand } from "../../lib/tripMatching";
import type { TripPool, TripPropertyCommand } from "../../rules/types";
import { formatBidCommandInputToJss } from "../../lib/jssTripPropertyFormatter";

// Local copies of the core enums/unions used in the UI
type CommandVerb = "AWARD" | "AVOID";
type TripPoolChoice = TripPool;

const VERBS: CommandVerb[] = ["AWARD", "AVOID"];
const POOLS: TripPoolChoice[] = ["L--", "L-", "L", "N", "H", "H+", "H++"];

export default function CommandPlaygroundPage() {
  const [kind, setKind] = useState<BidCommandKind>("DESTINATION");
  const [verb, setVerb] = useState<CommandVerb>("AWARD");
  const [pool, setPool] = useState<TripPoolChoice | "">("H");
  const [limit, setLimit] = useState<string>("");

  // DESTINATION
  const [destination, setDestination] = useState<string>("MLE");

  // TRIP_LENGTH_DAYS
  const [lengthOp, setLengthOp] = useState<TripLengthOperator>("EQUAL");
  const [lengthDays, setLengthDays] = useState<string>("4");
  const [lengthMin, setLengthMin] = useState<string>("4");
  const [lengthMax, setLengthMax] = useState<string>("5");

  // TRIP_REPORT_TIME
  const [timeOp, setTimeOp] = useState<TimeComparisonOperator>("EARLIER_THAN");
  const [timeValue, setTimeValue] = useState<string>("07:30");

  const [builtCommand, setBuiltCommand] = useState<TripPropertyCommand | null>(
    null
  );
  const [matchedTrips, setMatchedTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<BidCommandInput | null>(null);

  function buildInput(): BidCommandInput {
    const note = undefined; // we can add friendly labels later

    switch (kind) {
      case "DESTINATION":
        return {
          kind: "DESTINATION",
          verb,
          destination,
          pool: verb === "AWARD" && pool ? (pool as TripPoolChoice) : undefined,
          limit: limit ? Number(limit) : undefined,
          note,
        };

      case "TRIP_LENGTH_DAYS": {
        if (lengthOp === "BETWEEN") {
          return {
            kind: "TRIP_LENGTH_DAYS",
            verb,
            operator: lengthOp,
            minDays: lengthMin ? Number(lengthMin) : undefined,
            maxDays: lengthMax ? Number(lengthMax) : undefined,
            pool: verb === "AWARD" && pool ? (pool as TripPoolChoice) : undefined,
            limit: limit ? Number(limit) : undefined,
            note,
          };
        }
        return {
          kind: "TRIP_LENGTH_DAYS",
          verb,
          operator: lengthOp,
          days: lengthDays ? Number(lengthDays) : undefined,
          pool: verb === "AWARD" && pool ? (pool as TripPoolChoice) : undefined,
          limit: limit ? Number(limit) : undefined,
          note,
        };
      }

      case "TRIP_REPORT_TIME":
        return {
          kind: "TRIP_REPORT_TIME",
          verb,
          operator: timeOp,
          time: timeValue,
          pool: verb === "AWARD" && pool ? (pool as TripPoolChoice) : undefined,
          limit: limit ? Number(limit) : undefined,
          note,
        };
    }
  }

  function handleRun() {
    setError(null);
    try {
      const input = buildInput();
      const cmd = buildTripPropertyCommand(input);
      const trips = getTripsAffectedByCommand(cmd, sampleTrips);

      setLastInput(input);
      setBuiltCommand(cmd);
      setMatchedTrips(trips);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error");
      }
      setLastInput(null);
      setBuiltCommand(null);
      setMatchedTrips([]);
    }
  }

  return (
    <div className="min-h-screen px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        NextBid – Command playground (777 sample data)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: inputs */}
        <div className="space-y-4 border rounded-lg p-4">
          <h2 className="font-medium mb-2">Command builder</h2>

          {/* Verb */}
          <div>
            <label className="block text-sm font-medium mb-1">Command</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={verb}
              onChange={(e) => setVerb(e.target.value as CommandVerb)}
            >
              {VERBS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Kind */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Trip property
            </label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={kind}
              onChange={(e) => setKind(e.target.value as BidCommandKind)}
            >
              <option value="DESTINATION">Destination / layover</option>
              <option value="TRIP_LENGTH_DAYS">Trip length (days)</option>
              <option value="TRIP_REPORT_TIME">Report time (local)</option>
            </select>
          </div>

          {/* Conditional controls */}
          {kind === "DESTINATION" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Destination code
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. MLE, LAX, JFK"
              />
            </div>
          )}

          {kind === "TRIP_LENGTH_DAYS" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Length operator
                </label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={lengthOp}
                  onChange={(e) =>
                    setLengthOp(e.target.value as TripLengthOperator)
                  }
                >
                  <option value="EQUAL">Exactly</option>
                  <option value="AT_LEAST">At least</option>
                  <option value="AT_MOST">At most</option>
                  <option value="BETWEEN">Between</option>
                </select>
              </div>

              {lengthOp === "BETWEEN" ? (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Min days
                    </label>
                    <input
                      type="number"
                      min={1}
                      className="border rounded px-2 py-1 w-full"
                      value={lengthMin}
                      onChange={(e) => setLengthMin(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Max days
                    </label>
                    <input
                      type="number"
                      min={1}
                      className="border rounded px-2 py-1 w-full"
                      value={lengthMax}
                      onChange={(e) => setLengthMax(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="border rounded px-2 py-1 w-full"
                    value={lengthDays}
                    onChange={(e) => setLengthDays(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {kind === "TRIP_REPORT_TIME" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Time comparison
                </label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={timeOp}
                  onChange={(e) =>
                    setTimeOp(e.target.value as TimeComparisonOperator)
                  }
                >
                  <option value="EARLIER_THAN">Earlier than</option>
                  <option value="NOT_EARLIER_THAN">Not earlier than</option>
                  <option value="LATER_THAN">Later than</option>
                  <option value="NOT_LATER_THAN">Not later than</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Time (HH:MM)
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                  placeholder="07:30"
                />
              </div>
            </>
          )}

          {/* Pool & limit (only really meaningful for AWARD) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pool (priority)
            </label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={pool}
              onChange={(e) => setPool(e.target.value as TripPoolChoice | "")}
              disabled={verb === "AVOID"}
            >
              {POOLS.map((p: TripPoolChoice) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {verb === "AVOID" && (
              <p className="text-xs text-gray-500 mt-1">
                Pool is ignored for AVOID commands.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Limit (max times per roster, optional)
            </label>
            <input
              type="number"
              min={1}
              className="border rounded px-2 py-1 w-full"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="Leave blank for no limit"
            />
          </div>

          <button
            type="button"
            onClick={handleRun}
            className="mt-2 inline-flex items-center justify-center rounded px-3 py-1.5 text-sm font-medium border shadow-sm"
          >
            Build command &amp; test on sample trips
          </button>

          {error && (
            <p className="text-sm text-red-600 mt-2">Error: {error}</p>
          )}
        </div>

        {/* Centre: built command + JSS */}
        <div className="space-y-4 border rounded-lg p-4">
          <h2 className="font-medium mb-2">Generated command</h2>

          {lastInput ? (
            <>
              <div className="text-xs mb-2">
                <span className="font-semibold">JSS line (v1):</span>{" "}
                <code className="bg-gray-50 border px-1 py-[1px] rounded">
                  {formatBidCommandInputToJss(lastInput, 1)}
                </code>
              </div>

              {builtCommand ? (
                <div>
                  <div className="text-xs font-medium mb-1">
                    Engine TripPropertyCommand:
                  </div>
                  <pre className="text-[10px] bg-gray-50 border rounded p-2 overflow-x-auto">
{JSON.stringify(builtCommand, null, 2)}
                  </pre>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Build a command to see the JSS line and engine representation here.
            </p>
          )}
        </div>

        {/* Right: matching trips */}
        <div className="space-y-4 border rounded-lg p-4">
          <h2 className="font-medium mb-2">
            Matching trips ({matchedTrips.length})
          </h2>
          {matchedTrips.length === 0 ? (
            <p className="text-sm text-gray-500">
              No sample trips matched. Try a broader command.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {matchedTrips.map((trip) => (
                <li
                  key={trip.tripNumber}
                  className="border rounded px-2 py-1 bg-gray-50"
                >
                  <div className="font-semibold">
                    {trip.tripNumber} – {trip.route}
                  </div>
                  <div className="text-xs text-gray-600">
                    Days: {trip.tripDays} | Credit: {trip.tripCredit} | TAFB:{" "}
                    {trip.tafb}
                    {trip.reportTimeLocal && ` | Report: ${trip.reportTimeLocal}`}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
