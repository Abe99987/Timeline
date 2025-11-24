"use client";

import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { sampleEvents, type TimelineEvent } from "@/data/sampleEvents";
import {
  groupEventsByYear,
  generateYearRange,
  getRepresentativeYear,
} from "@/utils/timelineBuckets";
import {
  clampYear,
  formatYearLabel,
  formatYearRange,
} from "@/utils/yearFormatting";

// Layout constants
const YEAR_WIDTH = 112; // matches Tailwind w-28 (7rem)
const MAJOR_TICK_STEP = 10; // decades

type TimelineRailProps = {
  minYear: number;
  maxYear: number;
  focusYear: number;
  onFocusYearChange: (year: number) => void;
  events?: TimelineEvent[];
  eraStep: number;
  onSelectEvent?: (event: TimelineEvent) => void;
};

type YearColumnProps = {
  year: number;
  eventsForYear: TimelineEvent[];
  isFocus: boolean;
  isNeighbor: boolean;
  focusYear: number;
  onSelectEvent?: (event: TimelineEvent) => void;
  onYearSelect?: (year: number) => void;
};

function getClosestEvents(
  focusYear: number,
  events: TimelineEvent[],
  maxCount: number,
): TimelineEvent[] {
  return [...events]
    .map((event) => ({
      event,
      distance: Math.abs(getRepresentativeYear(event) - focusYear),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, Math.max(1, maxCount))
    .map((entry) => entry.event);
}

function MiniEventCard({
  event,
  isPrimary,
  onClick,
  variant = "neighbor",
}: {
  event: TimelineEvent;
  isPrimary: boolean;
  onClick?: () => void;
  variant?: "focus" | "neighbor" | "distant";
}) {
  const baseClasses =
    "flex flex-col rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60";

  const variantClasses =
    variant === "focus"
      ? "gap-2.5 border-sky-600/80 bg-slate-950/95 p-4 shadow-lg shadow-sky-900/25 ring-1 ring-sky-500/30"
      : variant === "neighbor"
        ? "gap-2 border-slate-800/70 bg-slate-950/85 p-3 opacity-90 hover:opacity-100"
        : "gap-1.5 border-slate-800/60 bg-slate-950/70 p-2 text-[11px] opacity-75 hover:opacity-95";

  const emphasisClasses = isPrimary
    ? "border-sky-500/80 ring-1 ring-sky-400/40 shadow-sky-900/30"
    : "";

  return (
    <article
      className={`${baseClasses} ${variantClasses} ${emphasisClasses}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-col gap-0.5">
        <h4
          className={`font-semibold text-slate-50 leading-tight ${
            variant === "focus" ? "text-sm" : variant === "neighbor" ? "text-[11px]" : "text-[10px]"
          }`}
        >
          {event.title}
        </h4>
        <p
          className={`truncate text-slate-400 ${
            variant === "focus" ? "text-xs" : "text-[10px]"
          }`}
        >
          {event.location}
        </p>
      </div>
      <span
        className={`self-start rounded-full px-2 py-0.5 font-medium text-slate-200 ${
          variant === "focus"
            ? "bg-sky-900/60 text-[11px] ring-1 ring-sky-500/60"
            : "bg-slate-900/80 text-[10px] ring-1 ring-slate-700/70"
        }`}
      >
        {formatYearRange(event.yearStart, event.yearEnd)}
      </span>
      {variant === "focus" ? (
        <p className="text-xs text-slate-300 line-clamp-3">{event.description}</p>
      ) : null}
      {isPrimary && (
        <div className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.3em] text-sky-400">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          Focus
        </div>
      )}
    </article>
  );
}

function FocusPlaceholderMini({ focusYear }: { focusYear: number }) {
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-sky-600/60 bg-slate-950/90 p-3 ring-1 ring-sky-500/20">
      <h4 className="text-xs font-semibold text-slate-50">No event</h4>
      <p className="text-[9px] text-slate-400">
        {formatYearLabel(focusYear)} – slot waiting
      </p>
      <div className="flex items-center gap-1 text-[8px] font-medium uppercase tracking-widest text-sky-400">
        <span className="h-1 w-1 rounded-full bg-sky-400" />
        Focus year
      </div>
    </article>
  );
}

function YearColumn({
  year,
  eventsForYear,
  isFocus,
  isNeighbor,
  focusYear,
  onSelectEvent,
  onYearSelect,
}: YearColumnProps) {
  const isMajorTick =
    ((year % MAJOR_TICK_STEP) + MAJOR_TICK_STEP) % MAJOR_TICK_STEP === 0;
  const isActive = year === focusYear;

  // Determine which event is "primary" (closest to focusYear)
  const primaryEvent = useMemo(() => {
    if (eventsForYear.length === 0) return null;
    if (eventsForYear.length === 1) return eventsForYear[0];

    let closest = eventsForYear[0];
    let closestDist = Math.abs(getRepresentativeYear(closest) - focusYear);

    for (const event of eventsForYear) {
      const dist = Math.abs(getRepresentativeYear(event) - focusYear);
      if (dist < closestDist) {
        closest = event;
        closestDist = dist;
      }
    }
    return closest;
  }, [eventsForYear, focusYear]);

  // Styling based on focus/neighbor status
  const columnHeight = isFocus ? "h-[360px]" : isNeighbor ? "h-[320px]" : "h-[300px]";
  const columnWidth = isFocus ? "w-32" : isNeighbor ? "w-24" : "w-20";
  const columnScale = isFocus
    ? "origin-bottom scale-[1.07]"
    : isNeighbor
      ? "origin-bottom scale-[0.97] opacity-90"
      : "origin-bottom scale-[0.92] opacity-70";
  const cardStackSizing = isFocus
    ? "max-h-[280px] overflow-y-auto pr-1"
    : isNeighbor
      ? "max-h-[140px] overflow-hidden"
      : "max-h-[110px] overflow-hidden";
  const cardStackTone = isFocus ? "" : "space-y-1.5";
  const cardVariant = isFocus ? "focus" : isNeighbor ? "neighbor" : "distant";
  const eventsToRender = eventsForYear;

  // Tick styling
  const tickHeight = isActive ? "h-14" : isMajorTick ? "h-10" : "h-6";
  const tickColor = isActive ? "bg-sky-400" : isMajorTick ? "bg-slate-500" : "bg-slate-600/80";

  return (
    <div
      data-year-column={year}
      className={`relative z-10 flex shrink-0 flex-col items-center justify-end transition-all duration-300 ${columnWidth} ${columnHeight} ${columnScale}`}
    >
      {/* Cards area */}
      <div
        className={`flex w-full flex-col space-y-2 ${cardStackTone} ${cardStackSizing} mb-2`}
      >
        {eventsToRender.length > 0 ? (
          eventsToRender.map((event) => (
            <MiniEventCard
              key={event.id}
              event={event}
              isPrimary={isFocus && event.id === primaryEvent?.id}
              onClick={() => onSelectEvent?.(event)}
              variant={cardVariant}
            />
          ))
        ) : isFocus ? (
          <div className="flex flex-1 flex-col">
            <FocusPlaceholderMini focusYear={focusYear} />
          </div>
        ) : (
          <div className="flex flex-1 items-end justify-center pb-4 text-[10px] text-slate-600/70">
            <span className="rounded-full border border-dashed border-slate-700/60 px-2 py-1">
              No cards
            </span>
          </div>
        )}
      </div>

      {/* Tick */}
      <button
        type="button"
        className="flex flex-col items-center gap-1 pt-1 text-slate-500 transition-colors focus:outline-none focus-visible:text-sky-200"
        aria-label={`Set focus year to ${formatYearLabel(year)}`}
        aria-pressed={isActive}
        onClick={() => onYearSelect?.(year)}
      >
        <span
          className={`w-px ${tickHeight} ${tickColor} transition-all ${
            isActive ? "shadow-[0_0_10px_rgba(56,189,248,0.85)]" : ""
          }`}
        />
        {isMajorTick ? (
          <span
            className={`whitespace-nowrap text-[9px] font-medium tracking-wide ${
              isActive ? "text-sky-300" : "text-slate-500"
            }`}
          >
            {formatYearLabel(year)}
          </span>
        ) : null}
        {isActive ? (
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600/40" />
        )}
      </button>
    </div>
  );
}

export function TimelineRail({
  minYear,
  maxYear,
  focusYear,
  onFocusYearChange,
  events = sampleEvents,
  eraStep,
  onSelectEvent,
}: TimelineRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  // Generate years and bucket events
  const years = useMemo(
    () => generateYearRange(minYear, maxYear),
    [minYear, maxYear],
  );
  const eventBuckets = useMemo(() => groupEventsByYear(events), [events]);
  const neighborRadius = Math.max(1, Math.round(Math.max(1, eraStep) / 15));
  const closestFocusEvents = useMemo(
    () => getClosestEvents(focusYear, events, 3),
    [events, focusYear],
  );

  const scrollYearIntoCenter = useCallback(
    (targetYear: number) => {
      const rail = railRef.current;
      if (!rail) return;

      const columnEl = rail.querySelector<HTMLDivElement>(
        `[data-year-column="${targetYear}"]`,
      );
      const containerWidth = rail.clientWidth;
      const maxScroll = Math.max(0, rail.scrollWidth - containerWidth);

      let columnCenter: number;
      if (columnEl) {
        columnCenter = columnEl.offsetLeft + columnEl.offsetWidth / 2;
      } else {
        const fallbackIndex = targetYear - minYear;
        columnCenter = fallbackIndex * YEAR_WIDTH + YEAR_WIDTH / 2;
      }

      const targetScroll = Math.min(
        Math.max(0, columnCenter - containerWidth / 2),
        maxScroll,
      );

      rail.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    },
    [minYear],
  );

  // Scroll to center focusYear on mount and when focusYear changes externally
  useEffect(() => {
    if (isDragging.current) return;
    scrollYearIntoCenter(focusYear);
  }, [focusYear, scrollYearIntoCenter]);

  // Derive focusYear from scroll position
  const deriveFocusYear = useCallback(
    (scrollLeft: number, containerWidth: number) => {
      const centerX = scrollLeft + containerWidth / 2;
      const centerIndex = Math.round(centerX / YEAR_WIDTH - 0.5);
      const clampedIndex = Math.max(0, Math.min(centerIndex, years.length - 1));
      return minYear + clampedIndex;
    },
    [years.length, minYear],
  );

  // Pointer event handlers for drag scrolling
  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rail = railRef.current;
      if (!rail) return;

      isDragging.current = true;
      hasDragged.current = false;
      startX.current = event.clientX;
      startScrollLeft.current = rail.scrollLeft;

      rail.setPointerCapture(event.pointerId);
      rail.style.cursor = "grabbing";
      rail.style.userSelect = "none";
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;

      const rail = railRef.current;
      if (!rail) return;

      const deltaX = event.clientX - startX.current;

      // Mark as dragged if moved more than 5px
      if (Math.abs(deltaX) > 5) {
        hasDragged.current = true;
      }

      const newScrollLeft = startScrollLeft.current - deltaX;
      rail.scrollLeft = newScrollLeft;

      // Continuously update focusYear as we drag
      const derivedYear = deriveFocusYear(newScrollLeft, rail.clientWidth);
      if (
        derivedYear !== focusYear &&
        derivedYear >= minYear &&
        derivedYear <= maxYear
      ) {
        onFocusYearChange(derivedYear);
      }
    },
    [deriveFocusYear, focusYear, minYear, maxYear, onFocusYearChange],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rail = railRef.current;
      if (!rail) return;

      rail.releasePointerCapture(event.pointerId);
      rail.style.cursor = "";
      rail.style.userSelect = "";

      isDragging.current = false;
      hasDragged.current = false;
    },
    [],
  );

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rail = railRef.current;
      if (!rail) return;

      rail.releasePointerCapture(event.pointerId);
      rail.style.cursor = "";
      rail.style.userSelect = "";
      isDragging.current = false;
      hasDragged.current = false;
    },
    [],
  );

  const handleYearSelect = useCallback(
    (year: number) => {
      const clampedYear = clampYear(year, minYear, maxYear);
      onFocusYearChange(clampedYear);
      if (!isDragging.current) {
        scrollYearIntoCenter(clampedYear);
      }
    },
    [maxYear, minYear, onFocusYearChange, scrollYearIntoCenter],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isDragging.current) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextYear = clampYear(focusYear + direction, minYear, maxYear);
    if (nextYear !== focusYear) {
      handleYearSelect(nextYear);
    }
  };

  const handleEventSelect = useCallback(
    (event: TimelineEvent) => {
      const representativeYear = clampYear(
        getRepresentativeYear(event),
        minYear,
        maxYear,
      );
      handleYearSelect(representativeYear);
      onSelectEvent?.(event);
    },
    [handleYearSelect, maxYear, minYear, onSelectEvent],
  );

  return (
    <section
      aria-label="Timeline rail"
      className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/85 p-4 shadow-sm sm:p-5"
    >
      {/* Header */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Timeline
          </p>
          <h2 className="text-sm font-semibold text-slate-50">
            Cards locked to the dial
          </h2>
          <p className="text-xs text-slate-400">
            Drag to scroll through time. Cards and ticks move together as one
            rail.
          </p>
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

      {/* Shared scroll container for cards + ticks */}
      <div
        ref={railRef}
        className="relative flex min-h-[380px] cursor-grab items-end gap-3 overflow-x-auto px-4 py-4 active:cursor-grabbing"
        role="slider"
        tabIndex={0}
        aria-label="Timeline scrubber"
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
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-sky-500/25"
        />
        {years.map((year) => {
          const eventsForYear = eventBuckets.get(year) ?? [];
          const isFocus = year === focusYear;
          const isNeighbor =
            !isFocus && Math.abs(year - focusYear) <= neighborRadius;
          const columnEvents = isFocus
            ? closestFocusEvents
            : isNeighbor
              ? eventsForYear.slice(0, 2)
              : eventsForYear.slice(0, 1);

          return (
            <YearColumn
              key={year}
              year={year}
              eventsForYear={columnEvents}
              isFocus={isFocus}
              isNeighbor={isNeighbor}
              focusYear={focusYear}
              onSelectEvent={handleEventSelect}
              onYearSelect={handleYearSelect}
            />
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-center text-[10px] text-slate-500">
        Drag to scroll • Click cards or ticks to jump • Arrow keys to nudge
      </p>
    </section>
  );
}

