"use client";

import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { clampYear, formatYearLabel } from "@/utils/yearFormatting";

type TimelineBarProps = {
  focusYear: number;
  onFocusYearChange: (year: number) => void;
  minYear: number;
  maxYear: number;
  majorTickStep?: number;
};

const DEFAULT_MAJOR_STEP = 25;
const TICK_WIDTH = 32; // w-8 = 2rem = 32px
const TICK_GAP = 8; // gap-2 = 0.5rem = 8px
const TICK_TOTAL = TICK_WIDTH + TICK_GAP;

export function TimelineBar({
  focusYear,
  onFocusYearChange,
  minYear,
  maxYear,
  majorTickStep = DEFAULT_MAJOR_STEP,
}: TimelineBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const years = useMemo(
    () =>
      Array.from(
        { length: maxYear - minYear + 1 },
        (_, index) => minYear + index,
      ),
    [minYear, maxYear],
  );

  const normalizedStep = Math.max(1, majorTickStep);

  // Scroll the focused year into view on mount and when focusYear changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isDragging.current) return;

    const yearIndex = focusYear - minYear;
    const tickCenter = yearIndex * TICK_TOTAL + TICK_WIDTH / 2;
    const containerCenter = container.clientWidth / 2;
    const targetScroll = tickCenter - containerCenter;

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: "smooth",
    });
  }, [focusYear, minYear]);

  // Snap to the nearest year based on current scroll position
  const snapToNearestYear = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const nearestIndex = Math.round(
      (containerCenter - TICK_WIDTH / 2) / TICK_TOTAL,
    );
    const clampedIndex = Math.max(0, Math.min(nearestIndex, years.length - 1));
    const nearestYear = minYear + clampedIndex;

    if (nearestYear !== focusYear) {
      onFocusYearChange(clampYear(nearestYear, minYear, maxYear));
    }
  }, [years.length, minYear, maxYear, focusYear, onFocusYearChange]);

  // Pointer event handlers for drag scrolling
  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    isDragging.current = true;
    hasDragged.current = false;
    startX.current = event.clientX;
    startScrollLeft.current = container.scrollLeft;

    container.setPointerCapture(event.pointerId);
    container.style.cursor = "grabbing";
    container.style.userSelect = "none";
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const container = containerRef.current;
    if (!container) return;

    const deltaX = event.clientX - startX.current;
    
    // Mark as dragged if moved more than 5px (to distinguish from clicks)
    if (Math.abs(deltaX) > 5) {
      hasDragged.current = true;
    }

    const newScrollLeft = startScrollLeft.current - deltaX;
    container.scrollLeft = newScrollLeft;

    // Continuously update focusYear as we drag
    const containerCenter = newScrollLeft + container.clientWidth / 2;
    const nearestIndex = Math.round(
      (containerCenter - TICK_WIDTH / 2) / TICK_TOTAL,
    );
    const clampedIndex = Math.max(0, Math.min(nearestIndex, years.length - 1));
    const provisionalYear = minYear + clampedIndex;

    if (provisionalYear !== focusYear && provisionalYear >= minYear && provisionalYear <= maxYear) {
      onFocusYearChange(provisionalYear);
    }
  }, [years.length, minYear, maxYear, focusYear, onFocusYearChange]);

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      container.releasePointerCapture(event.pointerId);
      container.style.cursor = "";
      container.style.userSelect = "";

      if (isDragging.current && hasDragged.current) {
        snapToNearestYear();
      }

      isDragging.current = false;
      hasDragged.current = false;
    },
    [snapToNearestYear],
  );

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      container.releasePointerCapture(event.pointerId);
      container.style.cursor = "";
      container.style.userSelect = "";
      isDragging.current = false;
      hasDragged.current = false;
    },
    [],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isDragging.current) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextYear = clampYear(focusYear + direction, minYear, maxYear);
    if (nextYear !== focusYear) {
      onFocusYearChange(nextYear);
    }
  };

  const handleTickClick = useCallback(
    (year: number) => {
      // Ignore click if it was a drag gesture
      if (hasDragged.current) return;
      onFocusYearChange(clampYear(year, minYear, maxYear));
    },
    [minYear, maxYear, onFocusYearChange],
  );

  const isMajorTick = (year: number) =>
    ((year % normalizedStep) + normalizedStep) % normalizedStep === 0;

  const header = (
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
  );

  const ruler = (
    <div
      ref={containerRef}
      className="mt-4 flex cursor-grab gap-2 overflow-x-auto pb-3 pt-1 scrollbar-hide active:cursor-grabbing"
      role="slider"
      tabIndex={0}
      aria-label="Timeline ruler"
      aria-valuemin={minYear}
      aria-valuemax={maxYear}
      aria-valuenow={focusYear}
      aria-valuetext={formatYearLabel(focusYear)}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerUp}
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
            onClick={() => handleTickClick(year)}
            className={`flex w-8 shrink-0 flex-col items-center justify-end gap-1 rounded-md pb-0.5 outline-none transition-colors ${
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
  );

  const hint = (
    <p className="mt-2 text-center text-[10px] text-slate-500">
      Drag to scroll • Click to select • Arrow keys to nudge
    </p>
  );

  return (
    <section
      aria-label="Timeline scrubber"
      className="rounded-3xl border border-slate-800 bg-slate-950/85 p-4 shadow-sm sm:p-5"
    >
      {header}
      {ruler}
      {hint}
    </section>
  );
}
