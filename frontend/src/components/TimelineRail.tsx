"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import type { TimelineEvent } from "@/data/sampleEvents";
import type { TimelineTick } from "@/utils/timelineBuckets";
import { formatYearRange } from "@/utils/yearFormatting";

type TimelineRailProps = {
  ticks: TimelineTick[];
  activeTickIndex: number;
  onActiveTickIndexChange: (index: number) => void;
  eraStep: number;
  onEventActivate?: (event: TimelineEvent) => void;
};

type YearColumnProps = {
  tick: TimelineTick;
  index: number;
  activeIndex: number;
  maxVisibleNeighbors: number;
  highlightedEventId: string | null;
  onHighlight: (tickId: string, eventId: string | null) => void;
  onTickSelect: (index: number) => void;
  onEventActivate?: (event: TimelineEvent) => void;
};

type EventPreviewCardProps = {
  event: TimelineEvent;
  variant: "focus" | "active" | "neighbor" | "outer" | "thumbnail";
  isHighlighted: boolean;
  canHighlight: boolean;
  onHighlight?: () => void;
  onActivate?: () => void;
};

const TICK_WIDTH = 92;
const COLUMN_GAP = 16;
const SLOT_WIDTH = TICK_WIDTH + COLUMN_GAP;
const HOME_SLOT_WIDTH = 168;
const HOME_SLOT_HEIGHT = 260;

function clampIndex(index: number, length: number) {
  if (length === 0) return 0;
  return Math.max(0, Math.min(index, length - 1));
}

function EventPreviewCard({
  event,
  variant,
  isHighlighted,
  canHighlight,
  onHighlight,
  onActivate,
}: EventPreviewCardProps) {
  const baseClasses =
    "flex flex-col rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md";

  const variantClasses =
    variant === "focus"
      ? "gap-3 border-sky-700/70 bg-slate-950/95 p-4 shadow-lg shadow-sky-900/25 ring-1 ring-sky-500/40"
      : variant === "active"
        ? "gap-3 border-sky-700/70 bg-slate-950/95 p-4 shadow-lg shadow-sky-900/25 ring-1 ring-sky-500/40"
        : variant === "neighbor"
          ? "gap-2 border-slate-800/80 bg-slate-950/80 p-3 opacity-90"
          : variant === "thumbnail"
            ? "gap-1 border-slate-800/60 bg-slate-950/60 p-2 text-[10px] opacity-70"
            : "gap-1.5 border-slate-800/70 bg-slate-950/70 p-2 text-[11px] opacity-80";

  const highlightClasses = isHighlighted
    ? "ring-2 ring-sky-400/70 border-sky-400/70 shadow-lg shadow-sky-400/20"
    : canHighlight
      ? "hover:border-sky-600/50 hover:shadow-sky-900/20"
      : "";

  const titleSize =
    variant === "focus" || variant === "active" 
      ? "text-sm" 
      : variant === "neighbor" 
        ? "text-[12px]" 
        : variant === "thumbnail"
          ? "text-[10px]"
          : "text-[11px]";
  const detailSize = variant === "focus" || variant === "active" ? "text-xs" : "text-[11px]";

  return (
    <article
      className={`${baseClasses} ${variantClasses} ${highlightClasses}`}
      role={canHighlight ? "button" : undefined}
      tabIndex={canHighlight ? 0 : -1}
      onClick={(e) => {
        if (!canHighlight) return;
        e.stopPropagation();
        onHighlight?.();
      }}
      onKeyDown={(event) => {
        if (!canHighlight) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onHighlight?.();
        }
      }}
      onDoubleClick={(e) => {
        if (!canHighlight) return;
        e.stopPropagation();
        onActivate?.();
      }}
    >
      <div className="flex flex-col gap-1">
        <h4 className={`font-semibold text-slate-50 leading-tight ${titleSize}`}>
          {event.title}
        </h4>
        <p className={`text-slate-400 ${detailSize}`}>{event.location}</p>
      </div>
      <span
        className={`self-start rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
          variant === "focus" || variant === "active"
            ? "bg-sky-900/60 text-sky-100 ring-1 ring-sky-500/50"
            : "bg-slate-900/70 text-slate-200 ring-1 ring-slate-700/60"
        }`}
      >
        {formatYearRange(event.yearStart, event.yearEnd)}
      </span>
      {variant === "focus" || variant === "active" ? (
        <p className="text-xs text-slate-300 line-clamp-3">{event.description}</p>
      ) : variant === "neighbor" ? (
        <p className="text-[11px] text-slate-400 line-clamp-2">
          {event.description}
        </p>
      ) : variant === "thumbnail" ? (
        <p className="text-[10px] text-slate-500 line-clamp-1">
          {event.description}
        </p>
      ) : null}

      {variant === "focus" && canHighlight ? (
        <button
          type="button"
          className="mt-1 self-start text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300 hover:text-sky-200 transition-colors"
          onClick={(evt) => {
            evt.stopPropagation();
            onActivate?.();
          }}
        >
          View details
        </button>
      ) : null}
    </article>
  );
}

function EmptyColumnCard({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/50 p-3 text-[11px] text-slate-400">
      <p>{label}</p>
      <span className="text-[10px] uppercase tracking-[0.25em] text-slate-600">
        Waiting for a story
      </span>
    </div>
  );
}

function YearColumn({
  tick,
  index,
  activeIndex,
  maxVisibleNeighbors,
  highlightedEventId,
  onHighlight,
  onTickSelect,
  onEventActivate,
}: YearColumnProps) {
  const distance = Math.abs(index - activeIndex);
  const isActive = distance === 0;
  const isNeighbor = distance === 1 || distance === 2;
  const isVisible = distance <= maxVisibleNeighbors;

  // Determine column dimensions based on distance
  const columnWidth = isActive 
    ? HOME_SLOT_WIDTH + 20 // Expanded width for active column
    : TICK_WIDTH; // Standard width for others
  
  const columnHeight = isActive 
    ? HOME_SLOT_HEIGHT // Full height for active column
    : "140px"; // Standard height for others

  // Position adjustment for active column to center it
  const positionOffset = isActive ? -(HOME_SLOT_WIDTH - TICK_WIDTH) / 2 : 0;

  return (
    <div
      className={`relative flex shrink-0 flex-col transition-all duration-300 ${
        isActive ? "z-20" : isNeighbor ? "z-10" : "z-0"
      }`}
      data-tick-index={index}
      style={{ 
        width: `${columnWidth}px`,
        marginLeft: `${positionOffset}px`,
        marginRight: `${-positionOffset}px`,
      }}
    >
      {/* Event cards section */}
      <div 
        className={`flex flex-col transition-all duration-300 ${
          isActive 
            ? "mb-3 h-full" 
            : "mb-3 flex-1 justify-end"
        }`}
        style={{ 
          height: isActive ? `${columnHeight}px` : columnHeight,
          opacity: isActive ? 1 : isNeighbor ? 0.8 : isVisible ? 0.6 : 0.4
        }}
      >
        {isActive ? (
          // Active column: full scrollable card area
          <div className="flex h-full w-full flex-col rounded-2xl border-2 border-sky-500/40 bg-slate-950/98 shadow-[0_0_30px_rgba(56,189,248,0.25)] backdrop-blur-sm">
            <div className="flex-1 overflow-y-auto p-3 pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(56 189 248 / 0.3) rgb(15 23 42 / 0.5)' }}>
              {tick.events.length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {tick.events.map((event) => (
                    <EventPreviewCard
                      key={event.id}
                      event={event}
                      variant="focus"
                      isHighlighted={highlightedEventId === event.id}
                      canHighlight={true}
                      onHighlight={() => onHighlight(tick.id, event.id)}
                      onActivate={() => onEventActivate?.(event)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-400">
                      No events for {tick.label}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Navigate to other years to explore events
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-sky-500/30 bg-sky-900/10 px-3 py-2">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-sky-300/90">
                {tick.label} {tick.events.length > 0 ? `• ${tick.events.length} event${tick.events.length === 1 ? '' : 's'}` : ''}
              </p>
            </div>
          </div>
        ) : isNeighbor ? (
          // Neighbor columns: condensed preview
          <div className="flex h-full w-full items-end pb-3">
            <div className="w-full">
              {tick.events.length > 0 ? (
                <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-2 transition-all">
                  <p className="text-[10px] font-medium text-slate-300">
                    {tick.events.length} {tick.events.length === 1 ? "event" : "events"}
                  </p>
                  <p className="text-[9px] text-slate-500 line-clamp-1">
                    {tick.events[0].title}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800/50 bg-slate-950/40 p-2">
                  <p className="text-[9px] text-slate-600">No events</p>
                </div>
              )}
            </div>
          </div>
        ) : isVisible ? (
          // Distant but visible columns: minimal indicator
          <div className="flex h-full w-full items-end justify-center pb-3">
            <span className="rounded-full border border-dashed border-slate-800/80 bg-slate-950/30 px-2 py-1 text-[10px] text-slate-600">
              {tick.events.length > 0 ? `${tick.events.length}` : "—"}
            </span>
          </div>
        ) : (
          // Very distant columns: just dots
          <div className="flex h-full w-full items-end justify-center pb-3">
            <span className="text-[10px] text-slate-600">…</span>
          </div>
        )}
      </div>

      {/* Tick marker - always at the bottom */}
      <button
        type="button"
        className="flex flex-col items-center gap-1 pt-1 text-slate-500 transition-colors focus:outline-none focus-visible:text-sky-200"
        aria-label={`Set focus year to ${tick.label}`}
        aria-pressed={isActive}
        onClick={() => onTickSelect(index)}
      >
        <span
          className={`w-px ${
            isActive ? "h-16" : tick.isMajor ? "h-12" : "h-8"
          } ${isActive ? "bg-sky-400" : "bg-slate-600"} transition-all ${
            isActive ? "shadow-[0_0_10px_rgba(56,189,248,0.85)]" : ""
          }`}
        />
        {tick.isMajor ? (
          <span
            className={`whitespace-nowrap text-[9px] font-medium tracking-wide ${
              isActive ? "text-sky-300" : "text-slate-500"
            }`}
          >
            {tick.label}
          </span>
        ) : null}
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isActive ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" : "bg-slate-600/60"
          }`}
        />
      </button>
    </div>
  );
}

export function TimelineRail({
  ticks,
  activeTickIndex,
  onActiveTickIndexChange,
  eraStep,
  onEventActivate,
}: TimelineRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [highlightedEventsByTick, setHighlightedEventsByTick] = useState<
    Record<string, string | null>
  >({});

  const activeTick = ticks[clampIndex(activeTickIndex, ticks.length)];
  const focusYearLabel = activeTick?.label ?? "—";
  const focusYearValue = activeTick?.year ?? 0;

  const maxVisibleNeighbors = useMemo(() => {
    const derived = Math.max(1, Math.round(eraStep / 12));
    return Math.min(3, Math.max(derived, 1));
  }, [eraStep]);

  const scrollTickIntoView = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      if (!track) return;

      const target = clampIndex(index, ticks.length);
      const columnEl = track.querySelector<HTMLDivElement>(
        `[data-tick-index="${target}"]`,
      );

      const containerWidth = track.clientWidth;
      const maxScroll = Math.max(0, track.scrollWidth - containerWidth);

      let columnCenter = target * SLOT_WIDTH + TICK_WIDTH / 2;
      if (columnEl) {
        columnCenter = columnEl.offsetLeft + columnEl.offsetWidth / 2;
      }

      const targetScroll = Math.min(
        Math.max(0, columnCenter - containerWidth / 2),
        maxScroll,
      );

      track.scrollTo({
        left: targetScroll,
        behavior,
      });
    },
    [ticks.length],
  );

  useEffect(() => {
    if (isDragging.current) return;
    scrollTickIntoView(activeTickIndex, "smooth");
  }, [activeTickIndex, scrollTickIntoView]);

  const deriveIndexFromScroll = useCallback(
    (scrollLeft: number, containerWidth: number) => {
      const centerX = scrollLeft + containerWidth / 2;
      const rawIndex = (centerX - TICK_WIDTH / 2) / SLOT_WIDTH;
      return clampIndex(Math.round(rawIndex), ticks.length);
    },
    [ticks.length],
  );

  const snapToNearestTick = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const nearestIndex = deriveIndexFromScroll(
      track.scrollLeft,
      track.clientWidth,
    );

    onActiveTickIndexChange(nearestIndex);
    scrollTickIntoView(nearestIndex);
  }, [deriveIndexFromScroll, onActiveTickIndexChange, scrollTickIntoView]);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    startX.current = event.clientX;
    startScrollLeft.current = track.scrollLeft;
    track.setPointerCapture(event.pointerId);
    track.style.cursor = "grabbing";
    track.style.userSelect = "none";
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;

      const track = trackRef.current;
      if (!track) return;

      const deltaX = event.clientX - startX.current;
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const nextScroll = Math.min(
        Math.max(0, startScrollLeft.current - deltaX),
        maxScroll,
      );
      track.scrollLeft = nextScroll;

      const derivedIndex = deriveIndexFromScroll(
        nextScroll,
        track.clientWidth,
      );
      if (derivedIndex !== activeTickIndex) {
        onActiveTickIndexChange(derivedIndex);
      }
    },
    [activeTickIndex, deriveIndexFromScroll, onActiveTickIndexChange],
  );

  const releasePointer = useCallback((pointerId: number) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = false;
    track.releasePointerCapture(pointerId);
    track.style.cursor = "";
    track.style.userSelect = "";
  }, []);

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      releasePointer(event.pointerId);
      snapToNearestTick();
    },
    [releasePointer, snapToNearestTick],
  );

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      releasePointer(event.pointerId);
      snapToNearestTick();
    },
    [releasePointer, snapToNearestTick],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = clampIndex(activeTickIndex + direction, ticks.length);
    onActiveTickIndexChange(nextIndex);
    scrollTickIntoView(nextIndex);
  };

  const handleTickSelect = useCallback(
    (index: number) => {
      onActiveTickIndexChange(index);
      // Let the useEffect handle the scrolling to avoid double-scrolling
    },
    [onActiveTickIndexChange],
  );

  const handleHighlight = useCallback(
    (tickId: string, eventId: string | null) => {
      setHighlightedEventsByTick((prev) => ({
        ...prev,
        [tickId]: eventId,
      }));
    },
    [],
  );

  return (
    <section
      aria-label="Timeline rail"
      className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/90 p-4 shadow-sm sm:p-5"
    >
      <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Dial
          </p>
          <h2 className="text-sm font-semibold text-slate-50">
            Odometer slot through time
          </h2>
          <p className="text-xs text-slate-400">
            Drag, nudge, or click ticks to move the rail beneath the fixed home
            window.
          </p>
        </div>
        <div className="text-left text-xs sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Focus year
          </p>
          <p className="text-base font-semibold text-sky-200">{focusYearLabel}</p>
        </div>
      </header>

      <div className="relative rounded-[32px] border border-slate-900/70 bg-slate-950/70">

        <div
          ref={trackRef}
          className="flex cursor-grab select-none items-end overflow-hidden px-6 pb-6 pt-6 active:cursor-grabbing"
          style={{ 
            minHeight: `${HOME_SLOT_HEIGHT + 100}px`,
            gap: `${COLUMN_GAP}px` 
          }}
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={Math.max(0, ticks.length - 1)}
          aria-valuenow={focusYearValue}
          aria-valuetext={focusYearLabel}
          aria-label="Timeline ticks"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onKeyDown={handleKeyDown}
        >
          {ticks.map((tick, index) => (
            <YearColumn
              key={tick.id}
              tick={tick}
              index={index}
              activeIndex={activeTickIndex}
              maxVisibleNeighbors={maxVisibleNeighbors}
              highlightedEventId={highlightedEventsByTick[tick.id] ?? null}
              onHighlight={handleHighlight}
              onTickSelect={handleTickSelect}
              onEventActivate={onEventActivate}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-500">
        Drag to scroll • Click ticks to jump • Arrow keys to nudge one year
      </p>
    </section>
  );
}
