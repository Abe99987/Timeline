const ticks = ["200 BCE", "0", "120 CE", "500 CE", "1200 CE"];

export function TimelineBar() {
  return (
    <section
      aria-label="Timeline scrubber"
      className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-sm sm:p-4"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-100 shadow-sm hover:border-slate-500 hover:bg-slate-800"
          aria-label="Previous period"
        >
          <span aria-hidden>←</span>
        </button>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex w-full items-center gap-2">
            <div className="h-[3px] flex-1 rounded-full bg-slate-800">
              <div className="h-full w-1/3 rounded-full bg-sky-500" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            {ticks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-100 shadow-sm hover:border-slate-500 hover:bg-slate-800"
          aria-label="Next period"
        >
          <span aria-hidden>→</span>
        </button>

        <div className="hidden flex-col items-end text-right text-xs sm:flex">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Focus year
          </span>
          <span className="text-sm font-semibold text-slate-50">120 CE</span>
        </div>
      </div>
    </section>
  );
}



