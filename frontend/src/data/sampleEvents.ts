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
  // Additional events for year 100 CE to test scrolling
  {
    id: "han-expansion-100",
    title: "Han Dynasty western expansion",
    location: "Western China",
    tags: ["Empire", "Military"],
    yearStart: 95,
    yearEnd: 105,
    description:
      "Military campaigns push Han influence deeper into Central Asia, securing trade routes.",
  },
  {
    id: "trajan-preparation",
    title: "Trajan's Dacian preparations",
    location: "Roman Empire",
    tags: ["Wars", "Strategy"],
    yearStart: 98,
    yearEnd: 101,
    description:
      "Rome masses legions along the Danube, preparing for campaigns against Dacia.",
  },
  {
    id: "kanishka-ascent",
    title: "Kanishka's early reign",
    location: "Kushan Empire",
    tags: ["Power", "Religion"],
    yearStart: 99,
    yearEnd: 102,
    description:
      "The great Kushan emperor begins consolidating power and patronizing Buddhist institutions.",
  },
  {
    id: "moche-pottery",
    title: "Moche ceramics flourish",
    location: "Peru coast",
    tags: ["Art", "Culture"],
    yearStart: 90,
    yearEnd: 110,
    description:
      "Elaborate portrait vessels and narrative scenes reach new heights of sophistication.",
  },
  {
    id: "axum-trade",
    title: "Axumite Red Sea trade",
    location: "Ethiopia",
    tags: ["Trade", "Maritime"],
    yearStart: 95,
    yearEnd: 120,
    description:
      "Ethiopian kingdom controls key ports, linking Africa with Arabia and the Mediterranean.",
  },
  {
    id: "paper-invention",
    title: "Paper spreads from China",
    location: "China",
    tags: ["Technology", "Writing"],
    yearStart: 100,
    yearEnd: 105,
    description:
      "New writing material begins replacing bamboo strips and silk, revolutionizing record-keeping.",
  },
  {
    id: "nasca-lines",
    title: "Nazca Lines construction",
    location: "Southern Peru",
    tags: ["Monuments", "Religion"],
    yearStart: 80,
    yearEnd: 150,
    description:
      "Massive geoglyphs etched into desert floor, possibly for ritual processions or astronomy.",
  },
];


