// src/app/page.tsx
import Image from "next/image";
import { sampleTrips } from "../data/sampleTrips";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Logo + title */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 md:h-28 md:w-28 relative">
            <Image
              src="/Nextbid-logo.png"
              alt="NextBid logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-sky-100">
              NextBid
            </h1>
            <p className="text-xs md:text-sm font-medium uppercase tracking-[0.25em] text-sky-400">
              BA 777 Bidding — Beta
            </p>
          </div>
        </div>

        {/* Hero copy */}
        <p className="mt-5 text-center text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
          Smart, rule-aware bid generation for BA pilots. Starting with the 777
          fleet, NextBid will build fully legal, personalised bidlines you can
          paste directly into IBID.
        </p>

        {/* Dev roadmap card */}
        <div className="mt-8 w-full max-w-xl rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-lg shadow-slate-950/40 p-5 md:p-6">
          <p className="text-[11px] md:text-xs font-semibold text-sky-300 mb-3 tracking-wide">
            NEXT STEPS · DEV BUILD
          </p>
          <ul className="text-xs md:text-sm text-slate-200 space-y-2 list-disc list-inside">
            <li>Pairing upload &amp; robust parsing for BA 777 pairings</li>
            <li>Preference profile setup for individual pilots</li>
            <li>Bidline / JSS rule engine with legality checks</li>
            <li>15-line bid generator with IBID-compatible export</li>
          </ul>
        </div>

        {/* Sample data section – real-ish 777 trips */}
        <section className="mt-16 w-full max-w-4xl">
          <h2 className="text-xs font-semibold tracking-[0.3em] text-sky-400 uppercase mb-3 text-center md:text-left">
            SAMPLE 777 FO TRIPS · JAN 2026
          </h2>
          <p className="text-sm text-slate-300 mb-4 text-center md:text-left">
            We&apos;ll build and test NextBid against real JSSTRIPS data. Here
            are a few example 777 trips from the FO plan for January 2026.
          </p>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-900/70">
                <tr>
                  <th className="px-4 py-3 text-slate-300">Trip</th>
                  <th className="px-4 py-3 text-slate-300">Route</th>
                  <th className="px-4 py-3 text-slate-300">Days</th>
                  <th className="px-4 py-3 text-slate-300">Credit</th>
                  <th className="px-4 py-3 text-slate-300">TAFB</th>
                </tr>
              </thead>
              <tbody>
                {sampleTrips.map((trip) => (
                  <tr
                    key={trip.tripNumber}
                    className="border-t border-slate-800/70 hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-sky-300">
                      {trip.tripNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-100">{trip.route}</td>
                    <td className="px-4 py-3 text-slate-200">{trip.tripDays}</td>
                    <td className="px-4 py-3 text-slate-200">
                      {trip.tripCredit}
                    </td>
                    <td className="px-4 py-3 text-slate-200">{trip.tafb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
