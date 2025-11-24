"use client";

import { useState } from "react";

import { ChatBox } from "@/components/ChatBox";
import { EventCardsColumn } from "@/components/EventCardsColumn";
import { FiltersPanel } from "@/components/FiltersPanel";
import { MapPanel } from "@/components/MapPanel";
import { TimelineBar } from "@/components/TimelineBar";
import { clampYear } from "@/utils/yearFormatting";

const MIN_YEAR = -200;
const MAX_YEAR = 200;
const ERA_STEP = 25;
const INITIAL_FOCUS_YEAR = 120;

export default function Home() {
  const [focusYear, setFocusYear] = useState(INITIAL_FOCUS_YEAR);

  const handleFocusYearChange = (year: number) => {
    setFocusYear(clampYear(year, MIN_YEAR, MAX_YEAR));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-1 flex flex-col gap-2 border-b border-slate-900 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Source Timeline
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              A map-first way to explore how the world changed over time
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-slate-400 sm:text-sm">
              This is the first visual slice of the interface. Everything you
              see here is placeholder content wired for layout only.
            </p>
          </div>
          <div className="mt-1 flex gap-2 text-[11px] text-slate-400 sm:mt-0">
            <span className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1">
              MVP layout v0
            </span>
          </div>
        </header>

        {/* Filters tile - full-width at top */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-5xl">
            <FiltersPanel />
          </div>
        </section>

        {/* Map panel - big and centered */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-5xl">
            <MapPanel focusYear={focusYear} />
          </div>
        </section>

        {/* Event cards - three stacks beneath map */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-5xl">
            <EventCardsColumn focusYear={focusYear} eraStep={ERA_STEP} />
          </div>
        </section>

        {/* Timeline ruler - beneath event stacks */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-5xl">
            <TimelineBar
              focusYear={focusYear}
              onFocusYearChange={handleFocusYearChange}
              minYear={MIN_YEAR}
              maxYear={MAX_YEAR}
              majorTickStep={ERA_STEP}
            />
          </div>
        </section>

        {/* Chat box - at bottom */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-5xl">
            <ChatBox />
          </div>
        </section>
      </main>
    </div>
  );
}
