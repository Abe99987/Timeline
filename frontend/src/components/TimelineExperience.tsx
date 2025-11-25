"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { MapPanel } from "@/components/MapPanel";
import { TimelineRail } from "@/components/TimelineRail";
import { sampleEvents, type TimelineEvent } from "@/data/sampleEvents";
import {
  buildTimelineTicks,
  type TimelineTick,
} from "@/utils/timelineBuckets";
import { formatYearRange } from "@/utils/yearFormatting";

type TimelineExperienceProps = {
  minYear: number;
  maxYear: number;
  eraStep: number;
  initialFocusYear: number;
  events?: TimelineEvent[];
};

function clampIndex(index: number, length: number) {
  if (length === 0) return 0;
  return Math.max(0, Math.min(index, length - 1));
}

function findNearestTickIndex(ticks: TimelineTick[], targetYear: number) {
  if (!ticks.length) return 0;

  let closestIndex = 0;
  let smallestDistance = Math.abs(ticks[0].year - targetYear);

  for (let i = 1; i < ticks.length; i += 1) {
    const distance = Math.abs(ticks[i].year - targetYear);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
}

export function TimelineExperience({
  minYear,
  maxYear,
  eraStep,
  initialFocusYear,
  events,
}: TimelineExperienceProps) {
  const eventSource = events ?? sampleEvents;

  const ticks = useMemo(
    () =>
      buildTimelineTicks({
        minYear,
        maxYear,
        events: eventSource,
        majorTickStep: eraStep,
      }),
    [eventSource, eraStep, maxYear, minYear],
  );

  const defaultIndex = useMemo(
    () => findNearestTickIndex(ticks, initialFocusYear),
    [initialFocusYear, ticks],
  );

  const [activeTickIndex, setActiveTickIndex] = useState(defaultIndex);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Keep the active index in range whenever ticks change.
  useEffect(() => {
    setActiveTickIndex((prev) => clampIndex(prev, ticks.length));
  }, [ticks.length]);

  // Reset the active index when the default target year shifts.
  useEffect(() => {
    setActiveTickIndex(defaultIndex);
  }, [defaultIndex]);

  const focusYear =
    ticks[activeTickIndex]?.year ?? ticks[defaultIndex]?.year ?? initialFocusYear;

  const handleActiveTickIndexChange = useCallback(
    (nextIndex: number) => {
      setActiveTickIndex((prev) => {
        const clamped = clampIndex(nextIndex, ticks.length);
        return prev === clamped ? prev : clamped;
      });
    },
    [ticks.length],
  );

  const handleEventActivate = useCallback((event: TimelineEvent) => {
    setSelectedEvent(event);
    if (process.env.NODE_ENV !== "production") {
      console.info("[TimelineExperience] Activated event", event.id);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <MapPanel focusYear={focusYear} />

      <TimelineRail
        ticks={ticks}
        activeTickIndex={activeTickIndex}
        onActiveTickIndexChange={handleActiveTickIndexChange}
        eraStep={eraStep}
        onEventActivate={handleEventActivate}
      />

      <section className="rounded-2xl border border-slate-900/80 bg-slate-950/50 p-4 text-xs text-slate-300">
        {selectedEvent ? (
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                Selected event
              </p>
              <p className="text-sm font-semibold text-slate-50">
                {selectedEvent.title}
              </p>
              <p className="text-[11px] text-slate-400">
                {selectedEvent.location} •{" "}
                {formatYearRange(selectedEvent.yearStart, selectedEvent.yearEnd)}
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              “View details” will open a drawer in the next PR.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-400">
              Double-click a card in the active slot to mark it for the upcoming
              detail drawer.
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600">
              No event selected
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

