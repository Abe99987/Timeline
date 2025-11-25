"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { EventDetailDrawer } from "@/components/EventDetailDrawer";
import { MapPanel } from "@/components/MapPanel";
import { TimelineRail } from "@/components/TimelineRail";
import { sampleEvents, type TimelineEvent } from "@/data/sampleEvents";
import {
  buildTimelineTicks,
  type TimelineTick,
} from "@/utils/timelineBuckets";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    setIsDrawerOpen(true);
    if (process.env.NODE_ENV !== "production") {
      console.info("[TimelineExperience] Activated event", event.id);
    }
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
    // Keep the selected event in state for potential re-opening
    // or clear it if you prefer: setSelectedEvent(null);
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

      <EventDetailDrawer
        event={selectedEvent}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}

