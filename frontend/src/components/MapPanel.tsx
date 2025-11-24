export function MapPanel() {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Map panel
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-50">
            Historical map for the selected year
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            This area will eventually visualize how the world changes as you
            scrub across time.
          </p>
        </div>
        <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300 ring-1 ring-slate-700/80">
          Placeholder view
        </span>
      </header>

      <div className="relative mt-1 aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/70 via-slate-900 to-slate-950" />
        <div className="relative flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-sm font-medium text-slate-50">
            Map panel – will show historical map for the selected year
          </p>
          <p className="max-w-md text-xs text-slate-200/90">
            Imagine a time-aware map that reveals borders, trade routes,
            conflicts, and cultures as you move through the timeline.
          </p>
        </div>
      </div>
    </section>
  );
}



