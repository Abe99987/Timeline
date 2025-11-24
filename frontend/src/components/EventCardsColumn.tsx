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
};

type EventStack = {
  key: "prev" | "current" | "next";
  label: string;
  anchor: number;
  events: TimelineEvent[];
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

function groupEventsByAnchor(events: TimelineEvent[], step: number) {
  const normalizedStep = Math.max(1, step);
  return events.reduce<Map<number, TimelineEvent[]>>((map, event) => {
    const midpoint = Math.round((event.yearStart + event.yearEnd) / 2);
    const anchor = getEraAnchor(midpoint, normalizedStep);
    const nextList = map.get(anchor) ?? [];
    nextList.push(event);
    map.set(anchor, nextList);
    return map;
  }, new Map());
}

function EventStackColumn({
  stack,
  eraStep,
  highlight,
}: {
  stack: EventStack;
  eraStep: number;
  highlight: boolean;
}) {
  const containerBase =
    "flex flex-1 flex-col rounded-2xl border p-4 shadow-sm transition-colors sm:p-5";
  const emphasis = highlight
    ? "border-sky-800/60 bg-slate-950/95 shadow-sky-900/30 shadow-lg"
    : "border-slate-800 bg-slate-950/70 opacity-90";
  const width = highlight ? "lg:flex-[1.35]" : "lg:flex-[0.95]";

  return (
    <div className={`${containerBase} ${emphasis} ${width}`}>
      <div className="flex items-baseline justify-between gap-2 text-[11px] uppercase tracking-[0.25em] text-slate-500">
        <span>{stack.label}</span>
        <span className="text-[10px] text-slate-400">
          {eraWindowLabel(stack.anchor, eraStep)}
        </span>
      </div>

      <div className="mt-3 space-y-3">
        {stack.events.length > 0 ? (
          stack.events.slice(0, 2).map((event) => (
            <article
              key={event.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/90 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-50">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-400">{event.location}</p>
                </div>
                <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-sky-600/70">
                  {formatYearRange(event.yearStart, event.yearEnd)}
                </span>
              </div>
              <p className="text-xs text-slate-300">{event.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <TagPill key={`${event.id}-${tag}`} label={tag} />
                ))}
              </div>
            </article>
          ))
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
}: EventCardsColumnProps) {
  const normalizedStep = Math.max(1, eraStep);
  const currentAnchor = getEraAnchor(focusYear, normalizedStep);
  const prevAnchor = currentAnchor - normalizedStep;
  const nextAnchor = currentAnchor + normalizedStep;

  const buckets = groupEventsByAnchor(sampleEvents, normalizedStep);

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
    <section aria-label="Example historical events" className="space-y-4">
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

      <div className="flex flex-col gap-3 lg:flex-row">
        {stacks.map((stack) => (
          <EventStackColumn
            key={stack.key}
            stack={stack}
            eraStep={normalizedStep}
            highlight={stack.key === "current"}
          />
        ))}
      </div>
    </section>
  );
}
