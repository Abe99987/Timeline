type EventCard = {
  id: number;
  title: string;
  years: string;
  location: string;
  tags: string[];
  summary: string;
};

const demoEvents: EventCard[] = [
  {
    id: 1,
    title: "Silk Road peak activity",
    years: "100–200 CE",
    location: "Central Asia ↔ Mediterranean",
    tags: ["Trade", "Currency", "Culture"],
    summary:
      "Merchants, caravans, and states knit together a fragile corridor moving silk, ideas, and disease between empires.",
  },
  {
    id: 2,
    title: "Spread of early Buddhism",
    years: "50–250 CE",
    location: "North India ↔ East Asia",
    tags: ["Religion", "Ideas", "Institutions"],
    summary:
      "Monks, translators, and patrons carry texts across mountain passes, reshaping local beliefs as they go.",
  },
  {
    id: 3,
    title: "Roman–Parthian frontier",
    years: "1–200 CE",
    location: "Eastern Mediterranean",
    tags: ["Wars", "Borders", "Power"],
    summary:
      "Two rival powers test each other through proxy wars, shifting borders, and intermittent peace treaties.",
  },
];

function TagPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300 ring-1 ring-slate-700/80">
      {label}
    </span>
  );
}

export function EventCardsColumn() {
  return (
    <section aria-label="Example historical events" className="space-y-3">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Events
        </p>
        <h2 className="text-sm font-semibold text-slate-50">
          Sample cards in the current view
        </h2>
        <p className="text-xs text-slate-400">
          Each card is a placeholder for a fully sourced, navigable historical
          event.
        </p>
      </header>

      <div className="space-y-3">
        {demoEvents.map((event) => (
          <article
            key={event.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-400">{event.location}</p>
              </div>
              <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-sky-600/70">
                {event.years}
              </span>
            </div>
            <p className="text-xs text-slate-300">{event.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {event.tags.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


