"use client";

import { sampleEvents, type TimelineEvent } from "@/data/sampleEvents";
import {
  formatYearRange,
  formatYearLabel,
  getEraAnchor,
} from "@/utils/yearFormatting";

type EventCardsColumnProps = {
  focusYear: number;
  eraStep: number;
  /** Callback when user clicks "Add event" on a placeholder (stub for future) */
  onAddEvent?: (year: number) => void;
};

type EventStack = {
  key: "prev" | "current" | "next";
  label: string;
  anchor: number;
  events: TimelineEvent[];
};

type PrimaryInfo = {
  anchor: number;
  eventId: string | null;
};

function TagPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300 ring-1 ring-slate-700/80">
      {label}
    </span>
  );
}

function eraWindowLabel(anchor: number, step: number) {
  const windowEnd = anchor + Math.max(1, step) - 1;
  return formatYearRange(anchor, windowEnd);
}

/** Get the representative year for an event (midpoint of its range) */
function getEventRepresentativeYear(event: TimelineEvent): number {
  return Math.round((event.yearStart + event.yearEnd) / 2);
}

/** Find the best event for a given focus year */
function getBestEventForYear(
  events: TimelineEvent[],
  focusYear: number,
  step: number,
): PrimaryInfo {
  const normalizedStep = Math.max(1, step);
  const currentAnchor = getEraAnchor(focusYear, normalizedStep);

  // First, try to find an event whose representative year exactly matches focusYear
  const exactMatch = events.find(
    (event) => getEventRepresentativeYear(event) === focusYear,
  );
  if (exactMatch) {
    return { anchor: currentAnchor, eventId: exactMatch.id };
  }

  // Otherwise, find events in the current era anchor
  const eventsInCurrentEra = events.filter((event) => {
    const repYear = getEventRepresentativeYear(event);
    const eventAnchor = getEraAnchor(repYear, normalizedStep);
    return eventAnchor === currentAnchor;
  });

  if (eventsInCurrentEra.length > 0) {
    // Find the event closest to the focusYear
    let closestEvent = eventsInCurrentEra[0];
    let closestDistance = Math.abs(
      getEventRepresentativeYear(closestEvent) - focusYear,
    );

    for (const event of eventsInCurrentEra) {
      const distance = Math.abs(getEventRepresentativeYear(event) - focusYear);
      if (distance < closestDistance) {
        closestEvent = event;
        closestDistance = distance;
      }
    }

    return { anchor: currentAnchor, eventId: closestEvent.id };
  }

  // No events in current era
  return { anchor: currentAnchor, eventId: null };
}

function groupEventsByAnchor(events: TimelineEvent[], step: number) {
  const normalizedStep = Math.max(1, step);
  return events.reduce<Map<number, TimelineEvent[]>>((map, event) => {
    const midpoint = getEventRepresentativeYear(event);
    const anchor = getEraAnchor(midpoint, normalizedStep);
    const nextList = map.get(anchor) ?? [];
    nextList.push(event);
    map.set(anchor, nextList);
    return map;
  }, new Map());
}

function EventCard({
  event,
  isPrimary,
}: {
  event: TimelineEvent;
  isPrimary: boolean;
}) {
  const baseClasses =
    "flex flex-col gap-3 rounded-2xl border bg-slate-950/90 transition-all duration-300";

  const emphasisClasses = isPrimary
    ? "border-sky-600/80 p-5 shadow-lg shadow-sky-900/20 ring-1 ring-sky-500/30 scale-[1.02]"
    : "border-slate-800/70 p-4 opacity-85 hover:opacity-100";

  return (
    <article className={`${baseClasses} ${emphasisClasses}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3
            className={`font-semibold text-slate-50 ${isPrimary ? "text-base" : "text-sm"}`}
          >
            {event.title}
          </h3>
          <p className={`text-slate-400 ${isPrimary ? "text-sm" : "text-xs"}`}>
            {event.location}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 font-medium text-slate-200 ${
            isPrimary
              ? "bg-sky-900/60 text-sm ring-2 ring-sky-500/50"
              : "bg-slate-900/80 text-xs ring-1 ring-sky-600/70"
          }`}
        >
          {formatYearRange(event.yearStart, event.yearEnd)}
        </span>
      </div>
      <p className={`text-slate-300 ${isPrimary ? "text-sm" : "text-xs"}`}>
        {event.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {event.tags.map((tag) => (
          <TagPill key={`${event.id}-${tag}`} label={tag} />
        ))}
      </div>
      {isPrimary && (
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-sky-400">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          Focus event
        </div>
      )}
    </article>
  );
}

function FocusPlaceholder({
  focusYear,
  onAddEvent,
}: {
  focusYear: number;
  onAddEvent?: (year: number) => void;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-sky-600/80 bg-slate-950/90 p-5 shadow-lg shadow-sky-900/20 ring-1 ring-sky-500/30 scale-[1.02] transition-all duration-300">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-50">
            No event recorded
          </h3>
          <p className="text-sm text-slate-400">
            Focus year: {formatYearLabel(focusYear)}
          </p>
        </div>
        <span className="rounded-full bg-sky-900/60 px-3 py-1 text-sm font-medium text-slate-200 ring-2 ring-sky-500/50">
          {formatYearLabel(focusYear)}
        </span>
      </div>
      <p className="text-sm text-slate-400">
        No event saved for {formatYearLabel(focusYear)} yet. Every year can have
        a story — this slot is waiting for one.
      </p>
      <button
        type="button"
        onClick={() => onAddEvent?.(focusYear)}
        className="mt-1 flex items-center gap-2 self-start rounded-lg border border-sky-700/60 bg-sky-900/30 px-3 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-900/50 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!onAddEvent}
      >
        <span className="text-base leading-none">+</span>
        Add event
      </button>
      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-sky-400">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
        Focus year
      </div>
    </article>
  );
}

function EventStackColumn({
  stack,
  eraStep,
  isPrimaryStack,
  primaryEventId,
  focusYear,
  onAddEvent,
}: {
  stack: EventStack;
  eraStep: number;
  isPrimaryStack: boolean;
  primaryEventId: string | null;
  focusYear: number;
  onAddEvent?: (year: number) => void;
}) {
  const containerBase =
    "flex flex-1 flex-col rounded-2xl border p-4 shadow-sm transition-all duration-300 sm:p-5";

  const emphasis = isPrimaryStack
    ? "border-sky-800/60 bg-slate-950/95 shadow-sky-900/30 shadow-lg scale-[1.01]"
    : "border-slate-800 bg-slate-950/70 opacity-80 scale-[0.98]";

  const width = isPrimaryStack ? "lg:flex-[1.4]" : "lg:flex-[0.9]";

  return (
    <div className={`${containerBase} ${emphasis} ${width}`}>
      <div className="flex items-baseline justify-between gap-2 text-[11px] uppercase tracking-[0.25em] text-slate-500">
        <span className={isPrimaryStack ? "text-sky-400" : ""}>
          {stack.label}
        </span>
        <span
          className={`text-[10px] ${isPrimaryStack ? "text-sky-300/80" : "text-slate-400"}`}
        >
          {eraWindowLabel(stack.anchor, eraStep)}
        </span>
      </div>

      <div className="mt-3 space-y-3">
        {stack.events.length > 0 ? (
          stack.events.slice(0, 2).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isPrimary={isPrimaryStack && event.id === primaryEventId}
            />
          ))
        ) : isPrimaryStack ? (
          <FocusPlaceholder focusYear={focusYear} onAddEvent={onAddEvent} />
        ) : (
          <p className="rounded-xl border border-dashed border-slate-800/80 bg-slate-950/60 p-3 text-xs text-slate-400">
            No sample events in this era yet.
          </p>
        )}
      </div>

      {stack.events.length > 2 ? (
        <p className="mt-2 text-[11px] text-slate-400">
          +{stack.events.length - 2} more placeholder events
        </p>
      ) : null}
    </div>
  );
}

export function EventCardsColumn({
  focusYear,
  eraStep,
  onAddEvent,
}: EventCardsColumnProps) {
  const normalizedStep = Math.max(1, eraStep);
  const currentAnchor = getEraAnchor(focusYear, normalizedStep);
  const prevAnchor = currentAnchor - normalizedStep;
  const nextAnchor = currentAnchor + normalizedStep;

  const buckets = groupEventsByAnchor(sampleEvents, normalizedStep);
  const primaryInfo = getBestEventForYear(sampleEvents, focusYear, normalizedStep);

  const stacks: EventStack[] = [
    {
      key: "prev",
      label: "Previous era",
      anchor: prevAnchor,
      events: buckets.get(prevAnchor) ?? [],
    },
    {
      key: "current",
      label: "Current era",
      anchor: currentAnchor,
      events: buckets.get(currentAnchor) ?? [],
    },
    {
      key: "next",
      label: "Next era",
      anchor: nextAnchor,
      events: buckets.get(nextAnchor) ?? [],
    },
  ];

  return (
    <div aria-label="Example historical events" className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Events
        </p>
        <h2 className="text-sm font-semibold text-slate-50">
          Era stacks around {formatYearLabel(focusYear)}
        </h2>
        <p className="text-xs text-slate-400">
          Cards are grouped by the timeline ruler&apos;s major ticks so you see
          what came before, during, and after each anchor window.
        </p>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        {stacks.map((stack) => (
          <EventStackColumn
            key={stack.key}
            stack={stack}
            eraStep={normalizedStep}
            isPrimaryStack={stack.anchor === primaryInfo.anchor}
            primaryEventId={primaryInfo.eventId}
            focusYear={focusYear}
            onAddEvent={onAddEvent}
          />
        ))}
      </div>
    </div>
  );
}
