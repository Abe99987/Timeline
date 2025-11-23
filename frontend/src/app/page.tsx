export default function Home() {
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

        <section className="grid gap-4 lg:grid-cols-[minmax(0,2.5fr)_minmax(260px,1fr)]">
          <div className="min-w-0">
            {/* Map panel */}
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <MapPanel />
          </div>
          <div className="min-w-0 lg:mt-0">
            {/* Filters panel – stacks below map on mobile */}
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <FiltersPanel />
          </div>
        </section>

        <section className="mt-2 flex flex-col gap-4">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            {/* Event cards */}
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <EventCardsColumn />
            {/* Timeline bar */}
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <TimelineBar />
          </div>
        </section>

        <section className="mt-2">
          {/* Chat box full-width at the bottom */}
          <div className="mx-auto w-full max-w-4xl">
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <ChatBox />
          </div>
        </section>
      </main>
    </div>
  );
}

import { MapPanel } from "@/components/MapPanel";
import { FiltersPanel } from "@/components/FiltersPanel";
import { EventCardsColumn } from "@/components/EventCardsColumn";
import { TimelineBar } from "@/components/TimelineBar";
import { ChatBox } from "@/components/ChatBox";

