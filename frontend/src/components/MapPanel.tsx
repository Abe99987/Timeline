"use client";

import { formatYearLabel } from "@/utils/yearFormatting";

type MapPanelProps = {
  focusYear: number;
};

export function MapPanel({ focusYear }: MapPanelProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[28px] border border-slate-800 bg-slate-950/85 p-5 shadow-lg shadow-slate-950/40 sm:p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Map panel
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-50">
            Historical map for {formatYearLabel(focusYear)}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            The timeline ruler at the bottom of the page controls this map,
            revealing borders, trade routes, and cultural shifts for each year.
          </p>
        </div>
        <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300 ring-1 ring-slate-700/80">
          Placeholder view
        </span>
      </header>

      <div className="relative w-full rounded-[24px] border border-slate-800 bg-slate-900/80">
        <div className="aspect-[5/3] w-full overflow-hidden rounded-[24px]">
          <div className="relative flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-sky-900/60 via-slate-900 to-slate-950 px-6 text-center">
            <p className="text-sm font-medium text-slate-50">
              Map panel – {formatYearLabel(focusYear)} focus
            </p>
            <p className="max-w-2xl text-xs text-slate-200/90">
              Imagine a time-aware map that responds to the ruler dial. As you
              rotate through each year, borders breathe, nodes brighten, and
              trade signals pulse to highlight what changed.
            </p>
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-300">
              Controlled by the ruler at the bottom
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
