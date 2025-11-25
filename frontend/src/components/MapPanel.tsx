"use client";

import { useMemo } from "react";
import { formatYearLabel } from "@/utils/yearFormatting";
import { getScenarioForYear } from "@/data/mapScenarios";
import { WorldUnderlay } from "@/components/map/WorldUnderlay";

type MapPanelProps = {
  focusYear: number;
};

// Visual configurations for scenario highlights
// Positions are percentage-based relative to the map container
const SCENARIO_VISUALS: Record<string, { top: string; left: string; width: string; height: string; color: string }> = {
  "silk-road-expansion": { top: "35%", left: "65%", width: "40%", height: "30%", color: "bg-amber-500" },
  "nazca-lines": { top: "65%", left: "28%", width: "25%", height: "25%", color: "bg-rose-500" },
  "nazca-lines-extended": { top: "65%", left: "28%", width: "30%", height: "30%", color: "bg-rose-600" },
  "roman-parthian-frontier": { top: "35%", left: "52%", width: "30%", height: "25%", color: "bg-orange-500" },
  "early-han-consolidation": { top: "35%", left: "75%", width: "35%", height: "25%", color: "bg-red-500" },
  "teotihuacan-rise": { top: "45%", left: "22%", width: "20%", height: "20%", color: "bg-emerald-500" },
  "default-world": { top: "50%", left: "50%", width: "90%", height: "80%", color: "bg-sky-500" },
};

export function MapPanel({ focusYear }: MapPanelProps) {
  // Derive scenario from focusYear - map only changes when scenario changes
  const scenario = useMemo(() => getScenarioForYear(focusYear), [focusYear]);
  
  const visual = SCENARIO_VISUALS[scenario.id] || SCENARIO_VISUALS["default-world"];

  return (
    <section className="flex flex-col gap-4 rounded-[28px] border border-slate-800 bg-slate-950/85 p-5 shadow-lg shadow-slate-950/40 sm:p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Map View – {scenario.label}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-50">
            Historical map for {formatYearLabel(focusYear)}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Region: {scenario.regionLabel}. Sources confirm activity in this area.
          </p>
        </div>
        <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300 ring-1 ring-slate-700/80">
          Scenario preview
        </span>
      </header>

      <div className="relative w-full rounded-[24px] border border-slate-800 bg-slate-900/80">
        <div className="aspect-5/3 w-full overflow-hidden rounded-[24px]">
          {/* Base Background */}
          <div className="relative h-full w-full bg-linear-to-br from-sky-950/50 via-slate-900 to-slate-950">
            
            {/* World Underlay (Static) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
               <WorldUnderlay className="h-full w-full text-slate-600" />
            </div>

            {/* Scenario Highlight Blob */}
            <div 
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] opacity-40 mix-blend-screen transition-all duration-700 ease-in-out ${visual.color}`}
              style={{
                top: visual.top,
                left: visual.left,
                width: visual.width,
                height: visual.height,
              }}
            />

            {/* Content Overlay */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <div>
                <p className="text-lg font-semibold text-slate-50 drop-shadow-sm">
                  {scenario.label}
                </p>
                <p className="mt-1 text-xs font-medium text-sky-300/80 drop-shadow-sm">
                  Focus region: {scenario.regionLabel}
                </p>
              </div>
              
              <p className="max-w-2xl text-sm leading-relaxed text-slate-200/90 drop-shadow-md">
                {scenario.summary}
              </p>
              
              {/* Lens tags */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {scenario.lensTags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-block rounded-full bg-slate-900/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-300 ring-1 ring-slate-700/50 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {scenario.markerLabel && (
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 px-3 py-1 text-[11px] text-slate-300 backdrop-blur-md">
                  Key markers: {scenario.markerLabel}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
