/**
 * Map scenarios keyed to year ranges for the Timeline map panel.
 * The map changes only when crossing scenario boundaries, not on every tick.
 */

export type MapScenario = {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  regionLabel: string;
  summary: string;
  lensTags: string[];
  markerLabel?: string;
};

export const MAP_SCENARIOS: MapScenario[] = [
  {
    id: "silk-road-expansion",
    label: "Silk Road corridor expansion",
    startYear: 90,
    endYear: 140,
    regionLabel: "Central Asia and Northern India",
    summary: "Trade networks reach their zenith as Han, Kushan, and Roman frontiers converge. Buddhist monks and merchants share the same oasis routes.",
    lensTags: ["trade", "religion", "currency"],
    markerLabel: "Kushan Empire centers"
  },
  {
    id: "nazca-lines",
    label: "Nazca geoglyphs construction",
    startYear: 80,
    endYear: 89,
    regionLabel: "Southern Peru",
    summary: "Massive lines and figures etched into the desert floor mark ritual pathways and possibly astronomical alignments.",
    lensTags: ["monuments", "religion", "phenomena"],
    markerLabel: "Nazca ceremonial sites"
  },
  {
    id: "nazca-lines-extended",
    label: "Nazca geoglyphs expansion",
    startYear: 141,
    endYear: 150,
    regionLabel: "Southern Peru",
    summary: "Later phase of geoglyph construction continues the tradition with more complex figures and expanded ritual landscapes.",
    lensTags: ["monuments", "religion", "culture"],
    markerLabel: "Extended Nazca sites"
  },
  {
    id: "roman-parthian-frontier",
    label: "Roman-Parthian frontier tensions",
    startYear: 1,
    endYear: 79,
    regionLabel: "Eastern Mediterranean and Mesopotamia",
    summary: "Proxy conflicts and diplomatic missions reshape border towns while merchants maintain quiet commerce across disputed frontiers.",
    lensTags: ["wars", "borders", "diplomacy"],
    markerLabel: "Contested frontier cities"
  },
  {
    id: "early-han-consolidation",
    label: "Han western consolidation",
    startYear: -200,
    endYear: 0,
    regionLabel: "China and Central Asian corridors",
    summary: "Han Dynasty extends control westward through the Hexi Corridor, establishing garrisons and beacon towers to secure emerging trade routes.",
    lensTags: ["borders", "logistics", "empire"],
    markerLabel: "Han frontier watchtowers"
  },
  {
    id: "teotihuacan-rise",
    label: "Teotihuacan urban expansion",
    startYear: 151,
    endYear: 200,
    regionLabel: "Central Mexico",
    summary: "Apartment compounds and obsidian workshops scale dramatically, projecting influence across Mesoamerica through trade and cultural exchange.",
    lensTags: ["urbanism", "trade", "culture"],
    markerLabel: "Teotihuacan pyramid complex"
  },
  {
    id: "default-world",
    label: "Global overview",
    startYear: -1000,
    endYear: 1000,
    regionLabel: "World",
    summary: "Multiple civilizations evolve independently and through connection. Select a specific year with the dial to focus on regional developments.",
    lensTags: ["overview"],
    markerLabel: "Major civilization centers"
  }
];

/**
 * Get the map scenario for a given focus year.
 * Returns the first scenario whose year range contains the focus year,
 * or falls back to the default world view.
 */
export function getScenarioForYear(focusYear: number): MapScenario {
  // Find first matching scenario (ordered by priority in the array)
  const scenario = MAP_SCENARIOS.find(
    s => focusYear >= s.startYear && focusYear <= s.endYear && s.id !== "default-world"
  );
  
  // Fall back to default world view
  if (!scenario) {
    return MAP_SCENARIOS.find(s => s.id === "default-world")!;
  }
  
  return scenario;
}
