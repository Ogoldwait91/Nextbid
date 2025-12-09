// src/app/dev/page.tsx
import { sampleTrips } from "../../data/sampleTrips";
import { renderTripPropertyCommand } from "../../rules/jssCommands";
import type { TripPropertyCommand } from "../../rules/types";
import { oliProfile } from "../../data/oliProfile";
import { buildSimpleBidGroup } from "../../lib/bidBuilder";

type GeneratedBidLine = {
  lineNumber: number;
  strength: 1 | 2 | 3 | 4 | 5;
  command: TripPropertyCommand;
};

export default function DevPage() {
  // Static example commands for the JSS preview
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

  // Generated bid group from Oli's profile (un-numbered commands)
  const generatedBidGroup = buildSimpleBidGroup(oliProfile);

  // Add T-numbers and simple strengths (V1 logic)
  const generatedBidLines: GeneratedBidLine[] = generatedBidGroup.map(
    (cmd, index) => {
      // Simple strength scheme for now:
      // T01: S5, T02: S4, T03: S4, rest: S3
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

  // Build export block (what you'd paste into IBID/JSS)
  const exportBlock = generatedBidLines
    .map((line) => {
      const tNumber = line.lineNumber.toString().padStart(2, "0");
      const cmdText = renderTripPropertyCommand(line.command);
      // You can tweak this format later to match exact JSS syntax
      return `T${tNumber} S${line.strength} ${cmdText}`;
    })
    .join("\n");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-sky-100">
            NextBid · Dev Playground
          </h1>
          <p className="text-sm text-slate-300">
            Internal view for working with real 777 trips and generating JSS
            commands and bidlines from structured preferences.
          </p>
        </header>

        {/* Sample trips */}
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
                    <td className="py-2 pr-3 text-slate-200">
                      {trip.tripDays}
                    </td>
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
            Example preference set: DXB and ATL preferred, BOM avoided
            completely. These objects are converted into JSS-style bid lines.
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
                        {"// "}{cmd.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Generated Bid Group from Oli's profile */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
          <h2 className="text-lg font-semibold text-sky-200 mb-3">
            Generated Bid Group (Oli – T01–T05)
          </h2>
          <p className="text-sm text-slate-300 mb-4">
            This simple V1 generator takes Oli&apos;s preference profile
            (DXB/ATL preferred, BOM avoided) and produces an ordered list of JSS
            commands with T-numbers and strengths, similar in spirit to what
            BidNav does.
          </p>

          {/* Pretty T-line view */}
          <div className="space-y-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl p-3 font-mono mb-4">
            {generatedBidLines.map((line) => {
              const tNumber = line.lineNumber.toString().padStart(2, "0");
              return (
                <div key={tNumber}>
                  <span className="text-slate-400 mr-2">
                    T{tNumber} S{line.strength}
                  </span>
                  {renderTripPropertyCommand(line.command)}
                  {line.command.note && (
                    <span className="ml-2 text-[10px] text-slate-400">
                      {"// "}{line.command.note}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Export block (copy-paste style) */}
          <div>
            <p className="text-xs text-slate-400 uppercase mb-2">
              Export block (copy into IBID/JSS – draft format)
            </p>
            <pre className="text-xs bg-slate-950/80 border border-slate-800 rounded-xl p-3 overflow-x-auto">
              {exportBlock}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
