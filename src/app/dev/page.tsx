// src/app/dev/page.tsx
import { sampleTrips } from "@/data/sampleTrips";
import { renderTripPropertyCommand } from "@/rules/jssCommands";
import type { TripPropertyCommand } from "@/rules/types";

export default function DevPage() {
  const exampleCommands: TripPropertyCommand[] = [
    {
      kind: "AWARD",
      property: "DESTINATION",
      qualifier: "DXB",
      tripPool: "H++",
      note: "Max-strength DXB preference",
    },
    {
      kind: "AWARD",
      property: "DESTINATION",
      qualifier: "ATL",
      tripPool: "H+",
      note: "Strong ATL preference",
    },
    {
      kind: "AVOID",
      property: "DESTINATION",
      qualifier: "BOM",
      note: "Avoid BOM completely",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-sky-100">
            NextBid · Dev Playground
          </h1>
          <p className="text-sm text-slate-300">
            Internal view for working with real 777 trips and generating JSS
            commands from structured preferences.
          </p>
        </header>

        {/* Sample trips (same data as homepage, but for dev use) */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
          <h2 className="text-lg font-semibold text-sky-200 mb-3">
            Sample 777 FO Trips (Jan 2026)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                  <th className="py-2 pr-3 text-left font-normal">Trip</th>
                  <th className="py-2 pr-3 text-left font-normal">Route</th>
                  <th className="py-2 pr-3 text-left font-normal">Days</th>
                  <th className="py-2 pr-3 text-left font-normal">Credit</th>
                  <th className="py-2 pr-3 text-left font-normal">
                    Time Away From Base
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleTrips.map((trip) => (
                  <tr
                    key={trip.tripNumber}
                    className="border-b border-slate-900/60 last:border-0"
                  >
                    <td className="py-2 pr-3 font-mono text-sky-200">
                      {trip.tripNumber}
                    </td>
                    <td className="py-2 pr-3 text-slate-100">{trip.route}</td>
                    <td className="py-2 pr-3 text-slate-200">{trip.tripDays}</td>
                    <td className="py-2 pr-3 text-slate-200">
                      {trip.tripCredit}
                    </td>
                    <td className="py-2 pr-3 text-slate-200">{trip.tafb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* JSS Command Preview */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
          <h2 className="text-lg font-semibold text-sky-200 mb-3">
            JSS Command Preview
          </h2>
          <p className="text-sm text-slate-300 mb-4">
            These commands represent a typical preference set:{" "}
            <span className="font-semibold">DXB</span> and{" "}
            <span className="font-semibold">ATL</span> preferred,{" "}
            <span className="font-semibold">BOM</span> avoided completely.
            We&apos;re converting structured objects into JSS-style bid lines.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Structured side */}
            <div>
              <p className="text-xs text-slate-400 uppercase mb-2">
                Structured commands (NextBid objects)
              </p>
              <pre className="text-xs bg-slate-950/80 border border-slate-800 rounded-xl p-3 overflow-x-auto">
                {JSON.stringify(exampleCommands, null, 2)}
              </pre>
            </div>

            {/* Rendered side */}
            <div>
              <p className="text-xs text-slate-400 uppercase mb-2">
                Rendered JSS lines
              </p>
              <div className="space-y-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl p-3 font-mono">
                {exampleCommands.map((cmd, idx) => (
                  <div key={idx}>
                    {renderTripPropertyCommand(cmd)}
                    {cmd.note && (
                      <span className="ml-2 text-[10px] text-slate-400">
                        � {cmd.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
