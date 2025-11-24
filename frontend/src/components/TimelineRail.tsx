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
const NEIGHBOR_RADIUS = 2; // years on each side considered "neighbors"

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
  eraStep: number;
  focusYear: number;
  onSelectEvent?: (event: TimelineEvent) => void;
};

function MiniEventCard({
  event,
  isPrimary,
  onClick,
}: {
  event: TimelineEvent;
  isPrimary: boolean;
  onClick?: () => void;
}) {
  const baseClasses =
    "flex flex-col gap-1.5 rounded-xl border bg-slate-950/90 transition-all duration-200 cursor-pointer hover:bg-slate-900/90";

  const emphasisClasses = isPrimary
    ? "border-sky-600/80 p-3 shadow-md shadow-sky-900/20 ring-1 ring-sky-500/30"
    : "border-slate-800/70 p-2.5 opacity-90 hover:opacity-100";

  return (
    <article
      className={`${baseClasses} ${emphasisClasses}`}
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
          className={`font-semibold text-slate-50 leading-tight ${isPrimary ? "text-xs" : "text-[10px]"}`}
        >
          {event.title}
        </h4>
        <p className="text-[9px] text-slate-400 truncate">{event.location}</p>
      </div>
      <span
        className={`self-start rounded-full px-2 py-0.5 font-medium text-slate-200 ${
          isPrimary
            ? "bg-sky-900/60 text-[9px] ring-1 ring-sky-500/50"
            : "bg-slate-900/80 text-[8px] ring-1 ring-slate-700/70"
        }`}
      >
        {formatYearRange(event.yearStart, event.yearEnd)}
      </span>
      {isPrimary && (
        <div className="flex items-center gap-1 text-[8px] font-medium uppercase tracking-widest text-sky-400">
          <span className="h-1 w-1 rounded-full bg-sky-400" />
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
  eraStep,
  focusYear,
  onSelectEvent,
}: YearColumnProps) {
  const isMajorTick = ((year % eraStep) + eraStep) % eraStep === 0;
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

  const visibleEvents = eventsForYear.slice(0, 2);
  const extraCount = Math.max(0, eventsForYear.length - visibleEvents.length);

  // Styling based on focus/neighbor status
  const columnWidth = "w-28";
  const columnScale = isFocus
    ? "scale-105"
    : isNeighbor
      ? "scale-100 opacity-90"
      : "scale-95 opacity-70";
  const cardStackSizing = isFocus
    ? "max-h-64 overflow-y-auto"
    : "max-h-48 overflow-hidden";

  // Tick styling
  const tickHeight = isMajorTick ? "h-10" : "h-6";
  const tickColor = isActive ? "bg-sky-400" : "bg-slate-600";

  return (
    <div
      className={`flex shrink-0 flex-col items-center gap-2 transition-all duration-300 ${columnWidth} ${columnScale}`}
    >
      {/* Cards area */}
      <div className={`w-full space-y-2 pb-2 scrollbar-hide ${cardStackSizing}`}>
        {visibleEvents.length > 0 ? (
          visibleEvents.map((event) => (
            <MiniEventCard
              key={event.id}
              event={event}
              isPrimary={isFocus && event.id === primaryEvent?.id}
              onClick={() => onSelectEvent?.(event)}
            />
          ))
        ) : isFocus ? (
          <FocusPlaceholderMini focusYear={focusYear} />
        ) : null}
        {extraCount > 0 ? (
          <p className="text-center text-[9px] text-slate-500">
            +{extraCount} more
          </p>
        ) : null}
      </div>

      {/* Tick */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <span
          className={`w-px ${tickHeight} ${tickColor} transition-all ${
            isActive ? "shadow-[0_0_6px_rgba(56,189,248,0.7)]" : ""
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
        {isActive && (
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
        )}
      </div>
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

  const normalizedStep = Math.max(1, eraStep);

  // Scroll to center focusYear on mount and when focusYear changes externally
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || isDragging.current) return;

    const yearIndex = focusYear - minYear;
    const columnCenter = yearIndex * YEAR_WIDTH + YEAR_WIDTH / 2;
    const containerCenter = rail.clientWidth / 2;
    const targetScroll = columnCenter - containerCenter;

    rail.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: "smooth",
    });
  }, [focusYear, minYear]);

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

  const handleEventSelect = useCallback(
    (event: TimelineEvent) => {
      const representativeYear = clampYear(
        getRepresentativeYear(event),
        minYear,
        maxYear,
      );
      onFocusYearChange(representativeYear);
      onSelectEvent?.(event);
    },
    [maxYear, minYear, onFocusYearChange, onSelectEvent],
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
        className="relative flex cursor-grab gap-2 overflow-x-auto px-4 py-4 scrollbar-hide active:cursor-grabbing"
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
        {years.map((year) => {
          const eventsForYear = eventBuckets.get(year) ?? [];
          const isFocus = year === focusYear;
          const isNeighbor =
            !isFocus && Math.abs(year - focusYear) <= NEIGHBOR_RADIUS;

          return (
            <YearColumn
              key={year}
              year={year}
              eventsForYear={eventsForYear}
              isFocus={isFocus}
              isNeighbor={isNeighbor}
              eraStep={normalizedStep}
              focusYear={focusYear}
              onSelectEvent={handleEventSelect}
            />
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-center text-[10px] text-slate-500">
        Drag to scroll • Click cards to expand • Arrow keys to nudge
      </p>
    </section>
  );
}

