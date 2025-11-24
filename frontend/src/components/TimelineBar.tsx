"use client";

import { useMemo, type KeyboardEvent } from "react";

import { clampYear, formatYearLabel } from "@/utils/yearFormatting";

type TimelineBarProps = {
  focusYear: number;
  onFocusYearChange: (year: number) => void;
  minYear: number;
  maxYear: number;
  majorTickStep?: number;
};

const DEFAULT_MAJOR_STEP = 25;

export function TimelineBar({
  focusYear,
  onFocusYearChange,
  minYear,
  maxYear,
  majorTickStep = DEFAULT_MAJOR_STEP,
}: TimelineBarProps) {
  const years = useMemo(
    () =>
      Array.from(
        { length: maxYear - minYear + 1 },
        (_, index) => minYear + index,
      ),
    [minYear, maxYear],
  );

  const normalizedStep = Math.max(1, majorTickStep);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextYear = clampYear(focusYear + direction, minYear, maxYear);
    if (nextYear !== focusYear) {
      onFocusYearChange(nextYear);
    }
  };

  const isMajorTick = (year: number) =>
    ((year % normalizedStep) + normalizedStep) % normalizedStep === 0;

  return (
    <section
      aria-label="Timeline scrubber"
      className="rounded-3xl border border-slate-800 bg-slate-950/85 p-4 shadow-sm sm:p-5"
    >
      <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            Dial
          </p>
          <h2 className="text-sm font-semibold text-slate-50">
            Ruler through time
          </h2>
        </div>
        <div className="text-left text-xs sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Focus year
          </p>
          <p className="text-base font-semibold text-sky-200">
            {formatYearLabel(focusYear)}
          </p>
        </div>
      </header>

      <div
        className="mt-4 flex gap-2 overflow-x-auto pb-3 pt-1"
        role="slider"
        tabIndex={0}
        aria-label="Timeline ruler"
        aria-valuemin={minYear}
        aria-valuemax={maxYear}
        aria-valuenow={focusYear}
        aria-valuetext={formatYearLabel(focusYear)}
        onKeyDown={handleKeyDown}
      >
        {years.map((year) => {
          const major = isMajorTick(year);
          const active = year === focusYear;

          const tickHeight = major ? "h-16" : "h-10";
          const tickColor = active ? "bg-sky-400" : "bg-slate-600";

          return (
            <button
              type="button"
              key={year}
              onClick={() =>
                onFocusYearChange(clampYear(year, minYear, maxYear))
              }
              className={`flex w-8 flex-col items-center justify-end gap-1 rounded-md pb-0.5 outline-none transition-colors ${
                active ? "text-sky-300" : "text-slate-500"
              }`}
              aria-label={`Set focus year to ${formatYearLabel(year)}`}
            >
              <span
                className={`w-px ${tickHeight} ${tickColor} transition-all ${
                  active ? "shadow-[0_0_8px_rgba(56,189,248,0.8)]" : ""
                }`}
              />
              {major ? (
                <span className="whitespace-nowrap text-[10px] font-medium tracking-wide">
                  {formatYearLabel(year)}
                </span>
              ) : (
                <span className="text-[8px] text-transparent">.</span>
              )}
              {active ? (
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
