// src/app/dashboard/layout.tsx
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/trips", label: "Trips", disabled: true },
  { href: "/dashboard/builder", label: "Bid Builder", disabled: true },
  { href: "/dashboard/export", label: "Export", disabled: true },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-slate-800 bg-slate-950/90 px-5 py-6 gap-6">
        {/* Logo + brand */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image
              src="/Nextbid-logo.png"
              alt="NextBid logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-sky-100">
              NextBid
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-400">
              777 Bidding · Beta
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 space-y-1">
          {navItems.map((item) => {
            const isDisabled = item.disabled;
            const baseClasses =
              "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors";
            const enabledClasses =
              "text-slate-200 hover:bg-slate-900 hover:text-sky-200";
            const disabledClasses = "text-slate-600 cursor-not-allowed";

            if (isDisabled) {
              return (
                <div
                  key={item.href}
                  className={`${baseClasses} ${disabledClasses}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span>{item.label}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-500">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseClasses} ${enabledClasses}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / dev link */}
        <div className="mt-auto pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Internal build</span>
          <Link
            href="/dev"
            className="text-[11px] text-sky-300 hover:text-sky-200 underline-offset-4 hover:underline"
          >
            Dev tools
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-4 py-3 flex items-center justify-between md:pl-8">
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-medium text-sky-100">
              Flightdeck
            </h1>
            <p className="text-[11px] text-slate-400">
              Preview of your 777 bid strategy based on current preferences.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="hidden sm:inline-flex px-2 py-1 rounded-full border border-slate-700 bg-slate-900/60">
              Fleet: B777 · Seat: FO
            </span>
            <span className="px-2 py-1 rounded-full border border-slate-700 bg-slate-900/60">
              Jan 26 · Demo data
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
