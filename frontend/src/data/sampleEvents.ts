export type TimelineEvent = {
  id: string;
  title: string;
  location: string;
  tags: string[];
  yearStart: number;
  yearEnd: number;
  description: string;
};

export const sampleEvents: TimelineEvent[] = [
  {
    id: "han-frontiers",
    title: "Han frontier watchtowers expand",
    location: "Hexi Corridor",
    tags: ["Borders", "Logistics"],
    yearStart: -175,
    yearEnd: -125,
    description:
      "Garrisons and beacon towers extend deeper into the corridor, tightening state control over steppe gateways.",
  },
  {
    id: "mauryan-fragment",
    title: "Fragmentation after the Maurya",
    location: "Northern India",
    tags: ["Power", "Institutions"],
    yearStart: -120,
    yearEnd: -60,
    description:
      "Regional courts emerge as the Mauryan system dissolves, setting up new trade and diplomatic patterns.",
  },
  {
    id: "silk-road-peak",
    title: "Silk Road peak traffic",
    location: "Central Asia ↔ Mediterranean",
    tags: ["Trade", "Currency", "Culture"],
    yearStart: 90,
    yearEnd: 210,
    description:
      "Caravans knit empires together with silks, spices, and envoys moving through oasis chains.",
  },
  {
    id: "buddhism-spread",
    title: "Early Buddhist networks",
    location: "North India ↔ East Asia",
    tags: ["Religion", "Ideas"],
    yearStart: 50,
    yearEnd: 250,
    description:
      "Monks and translators shepherd sutras over mountain passes, reinterpreting them at each stop.",
  },
  {
    id: "roman-parthian",
    title: "Roman–Parthian border diplomacy",
    location: "Eastern Mediterranean",
    tags: ["Wars", "Borders"],
    yearStart: 1,
    yearEnd: 200,
    description:
      "Proxy conflicts and envoys redraw frontier towns while merchants quietly keep commerce alive.",
  },
  {
    id: "kushan-minting",
    title: "Kushan gold minting",
    location: "Bactria ↔ Northern India",
    tags: ["Currency", "Culture"],
    yearStart: 120,
    yearEnd: 170,
    description:
      "Gold dinars blend Hellenistic and Indic iconography, signalling the empire’s cosmopolitan reach.",
  },
  {
    id: "teotihuacan-rise",
    title: "Teotihuacan urban ascent",
    location: "Central Mexico",
    tags: ["Urbanism", "Trade"],
    yearStart: 125,
    yearEnd: 225,
    description:
      "Apartment compounds and obsidian workshops scale up, exporting influence across Mesoamerica.",
  },
];


