type MessageRole = "system" | "historian" | "user";

type Message = {
  id: number;
  role: MessageRole;
  name: string;
  time: string;
  text: string;
};

const demoMessages: Message[] = [
  {
    id: 1,
    role: "system",
    name: "Source Timeline",
    time: "Now",
    text: "This chat will help you ask questions like “What changed along the Silk Road between 0 and 300 CE?”",
  },
  {
    id: 2,
    role: "historian",
    name: "Historian",
    time: "Now",
    text: "For now, messages here are static so you can see the layout — nothing is being logged or stored.",
  },
  {
    id: 3,
    role: "user",
    name: "You",
    time: "Draft",
    text: "Show me how coinage and religion moved together around 120 CE.",
  },
];

export function ChatBox() {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-sm sm:p-5">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Chat
          </p>
          <h2 className="text-sm font-semibold text-slate-50">
            Ask the map about what was happening
          </h2>
          <p className="text-xs text-slate-400">
            This is a static mock. In the real product, this will drive
            exploration and cite sources.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-100 sm:p-4">
        <div className="flex max-h-64 flex-col gap-3 overflow-y-auto">
          {demoMessages.map((message) => {
            const isUser = message.role === "user";
            const alignment = isUser ? "items-end" : "items-start";
            const bubbleClasses = isUser
              ? "bg-sky-600 text-slate-50"
              : "bg-slate-900/90 text-slate-50";
            const metaTextClasses = isUser
              ? "text-sky-100/80"
              : "text-slate-300";

            return (
              <div
                key={message.id}
                className={`flex flex-col gap-1 ${alignment}`}
              >
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  <span className={metaTextClasses}>{message.name}</span>
                  <span>•</span>
                  <span className="text-slate-500">{message.time}</span>
                </div>
                <div
                  className={`max-w-sm rounded-2xl px-3 py-2 text-[11px] leading-relaxed shadow ${bubbleClasses}`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2">
          <input
            type="text"
            disabled
            className="flex-1 bg-transparent text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none"
            placeholder="Ask about a period, place, or theme…"
          />
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 opacity-70"
            title="Chat is not wired up yet"
          >
            <span>Send</span>
          </button>
        </div>
      </div>
    </section>
  );
}


