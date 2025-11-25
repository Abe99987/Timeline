"use client";

import { useEffect, useRef } from "react";
import type { TimelineEvent } from "@/data/sampleEvents";
import { formatYearRange } from "@/utils/yearFormatting";

type EventDetailDrawerProps = {
  event: TimelineEvent | null;
  isOpen: boolean;
  onClose: () => void;
};

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300 ring-1 ring-slate-700/80">
      {label}
    </span>
  );
}

export function EventDetailDrawer({ event, isOpen, onClose }: EventDetailDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Manage focus and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      
      // Focus the drawer
      setTimeout(() => {
        drawerRef.current?.focus();
      }, 100);
    } else {
      // Restore body scroll
      document.body.style.overflow = "";
      
      // Return focus to previously focused element
      previouslyFocusedElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !event) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        className={`fixed right-0 top-0 z-50 h-full w-full overflow-hidden bg-slate-950/98 shadow-2xl transition-transform duration-300 ease-in-out sm:w-[60%] lg:w-[50%] xl:w-[45%] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-describedby="drawer-description"
        tabIndex={-1}
      >
        <div className="flex h-full flex-col border-l border-sky-800/50 bg-gradient-to-b from-slate-950 to-slate-950/95">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 bg-slate-950/50 px-6 py-5 backdrop-blur-sm sm:px-8">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-400">
                Event detail
              </p>
              <h2
                id="drawer-title"
                className="mt-1.5 text-xl font-bold text-slate-50 sm:text-2xl"
              >
                {event.title}
              </h2>
              <p className="mt-1.5 text-sm text-slate-400">
                {event.location}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-slate-200 hover:shadow-lg"
              aria-label="Close drawer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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

          {/* Scrollable content area */}
          <div 
            className="flex-1 overflow-y-auto px-6 py-6 sm:px-8"
            style={{ 
              scrollbarWidth: 'thin', 
              scrollbarColor: 'rgb(56 189 248 / 0.3) rgb(15 23 42 / 0.5)' 
            }}
          >
            {/* Year range badge */}
            <div className="mb-6">
              <span className="inline-block rounded-full bg-sky-900/60 px-4 py-1.5 text-sm font-medium text-sky-100 ring-2 ring-sky-500/50">
                {formatYearRange(event.yearStart, event.yearEnd)}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Description
              </h3>
              <p
                id="drawer-description"
                className="text-base leading-relaxed text-slate-300"
              >
                {event.description}
              </p>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <TagPill key={`${event.id}-${tag}`} label={tag} />
                ))}
              </div>
            </div>

            {/* Metadata section */}
            <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
              <p className="text-xs text-slate-500">
                Event identifier
              </p>
              <p className="mt-1 font-mono text-sm text-slate-400">
                {event.id}
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="border-t border-slate-800/60 bg-slate-950/50 px-6 py-4 backdrop-blur-sm sm:px-8">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
              >
                ← Return to timeline
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-sky-600/20 px-4 py-2 text-sm font-medium text-sky-300 ring-1 ring-sky-500/50 transition-all hover:bg-sky-600/30 hover:text-sky-200 hover:shadow-lg hover:shadow-sky-900/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

