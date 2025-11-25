"use client";

import type { TimelineEvent } from "@/data/sampleEvents";
import { formatYearRange } from "@/utils/yearFormatting";

type EventDetailDrawerProps = {
  event: TimelineEvent;
  onClose: () => void;
};

function TagPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300 ring-1 ring-slate-700/80">
      {label}
    </span>
  );
}

export function EventDetailDrawer({ event, onClose }: EventDetailDrawerProps) {
  return (
    <div
      className="animate-in slide-in-from-bottom-4 fade-in duration-300 rounded-3xl border border-sky-800/60 bg-slate-950/95 p-6 shadow-xl shadow-sky-900/20 ring-1 ring-sky-500/20 sm:p-8"
      role="dialog"
      aria-labelledby="drawer-title"
      aria-describedby="drawer-description"
    >
      {/* Header with close button */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-400">
            Event detail
          </p>
          <h2
            id="drawer-title"
            className="mt-1 text-xl font-semibold text-slate-50 sm:text-2xl"
          >
            {event.title}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{event.location}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          aria-label="Close drawer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Year range badge */}
      <div className="mt-4">
        <span className="inline-block rounded-full bg-sky-900/60 px-4 py-1.5 text-sm font-medium text-slate-200 ring-2 ring-sky-500/50">
          {formatYearRange(event.yearStart, event.yearEnd)}
        </span>
      </div>

      {/* Description */}
      <p
        id="drawer-description"
        className="mt-5 text-base leading-relaxed text-slate-300"
      >
        {event.description}
      </p>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {event.tags.map((tag) => (
          <TagPill key={`${event.id}-${tag}`} label={tag} />
        ))}
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-5">
        <p className="text-xs text-slate-500">
          Event ID: <code className="text-slate-400">{event.id}</code>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
        >
          Back to timeline
        </button>
      </div>
    </div>
  );
}

