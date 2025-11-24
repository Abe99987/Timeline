## Source Timeline frontend layout – landing view v0

The root route of the frontend (`/`) now renders a first visual slice of the Source Timeline interface: a map-first landing layout with filters, a column of example event cards, a horizontal timeline bar, and a chat box at the bottom. All content is placeholder-only and intentionally static so the layout can be evaluated quickly in staging/production without any backend or data dependencies.

- **`MapPanel`** (`src/components/MapPanel.tsx`): Large 16:9 hero-style map placeholder with copy describing the eventual historical map experience.
- **`FiltersPanel`** (`src/components/FiltersPanel.tsx`): Right-side panel with example theme and lens filter “chips” (e.g., Wars, Currency, Trade, Religion, Phenomena).
- **`EventCardsColumn`** (`src/components/EventCardsColumn.tsx`): Center column of 3 demo event cards showing title, years, location, tags, and short summaries.
- **`TimelineBar`** (`src/components/TimelineBar.tsx`): Horizontal scrubber-style bar with tick labels (e.g., 200 BCE → 1200 CE), a simple progress indicator, and a “Focus year” label (120 CE).
- **`ChatBox`** (`src/components/ChatBox.tsx`): Static chat mock with a few example messages and a disabled input + send button to show the future conversational surface.



