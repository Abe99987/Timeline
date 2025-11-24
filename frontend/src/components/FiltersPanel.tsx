"use client";

const primaryFilters = ["Wars", "Currency", "Trade", "Religion", "Phenomena"];
const secondaryFilters = ["People", "Technology", "Institutions"];

type FilterChipProps = {
  label: string;
  active?: boolean;
};

function FilterChip({ label, active }: FilterChipProps) {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors";
  const activeClasses =
    "border-sky-500/70 bg-sky-900/60 text-sky-50 shadow-sm";
  const inactiveClasses =
    "border-slate-800 bg-slate-900/80 text-slate-200 hover:border-slate-600";
  const classes = `${base} ${active ? activeClasses : inactiveClasses}`;

  return (
    <button type="button" className={classes}>
      {label}
    </button>
  );
}

export function FiltersPanel() {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm sm:p-5">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Filters
        </p>
        <h2 className="text-sm font-semibold text-slate-50">
          Choose which stories appear on the map
        </h2>
        <p className="text-xs text-slate-400">
          These are example dimensions. In the live app, you&apos;ll be able to
          combine them to shape the timeline.
        </p>
      </header>

      <div className="space-y-3">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Themes
          </p>
          <div className="flex flex-wrap gap-2">
            {primaryFilters.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                active={filter === "Phenomena"}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Lenses
          </p>
          <div className="flex flex-wrap gap-2">
            {secondaryFilters.map((filter) => (
              <FilterChip key={filter} label={filter} />
            ))}
          </div>
        </div>

        <div className="space-y-1 rounded-xl border border-dashed border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-400">
          <p className="font-medium text-slate-300">Time window</p>
          <p>
            In a future version this will let you narrow the years you are
            exploring.
          </p>
        </div>
      </div>
    </section>
  );
}



