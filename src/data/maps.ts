// Arc Raiders — Maps Database
// Source: arcraiders.wiki (scraped June 2026 via Cowork)
//
// Coverage:
//   Maps         : 7  (6 playable + Practice Range)
//   Named POIs   : 2  documented (Controlled Access Zone / Stacking Yard)
//   Unknown      : Most per-map POI names not yet documented on wiki (pois: [])
//
// topMaterials validation:
//   Confirmed present in ITEMS:
//     ARC Powercell, Advanced ARC Powercell, Battery, Mechanical Components,
//     Metal Parts, Wires
//   Mentioned on wiki but NOT yet in ITEMS — flagged inline below:
//     ARC Performance Steel, Industrial Battery, Leaper Pulse Unit, Motor,
//     Rocketeer Driver, Bastion Cell, Bombardier Cell, Sentinel Firing Core,
//     Surveyor Vault, Candleberry
//
// recommendedSize: wiki does not publish per-map recommended group size.
//   Values inferred from difficulty (Low→Solo, Medium→Duo, High/Extreme→Trio).
//
// Map names match weather.ts references exactly so v2/v3 can cross-reference.

import type { ItemCategory } from "../engine/types";

export interface POI {
  name: string;
  riskLevel: "Low" | "Medium" | "High" | "Extreme";
  notes: string;
}

export interface ArcMap {
  name: string;
  riskLevel: "Low" | "Medium" | "High" | "Extreme";
  recommendedSize: "Solo" | "Duo" | "Trio";
  description: string;
  lootBias: ItemCategory[];
  topMaterials: string[];
  pois: POI[];
}

export const MAPS: ArcMap[] = [
  {
    name: "Dam Battlegrounds",
    riskLevel: "Low",
    recommendedSize: "Solo",
    description:
      "The Alcantara Power Plant — \"The Dam\" — bisects a toxic, waterlogged swampland of scarred forests and hydroponic domes. Reliable loot density with a moderate ARC presence; the beginner-friendly entry point to the Rust Belt.",
    lootBias: ["Basic Material", "Topside Material"],
    topMaterials: ["Metal Parts", "Wires", "Battery", "ARC Powercell"],
    pois: [
      {
        name: "Controlled Access Zone",
        riskLevel: "High",
        notes:
          "Button-and-resource puzzle unlocking two tiered loot rooms; requires a Fuel Cell and coordinated switch activation, making it a high-contention site each raid.",
      },
    ],
  },

  {
    name: "Buried City",
    riskLevel: "Medium",
    recommendedSize: "Duo",
    description:
      "The sand-choked ruins of the pre-Collapse city of Marano, where tight corridors and sun-bleached rooftops reward nimble traversal and punish careless open-field movement.",
    lootBias: ["Basic Material", "Recyclable"],
    topMaterials: ["Metal Parts", "Wires", "Mechanical Components"],
    pois: [],
  },

  {
    name: "Spaceport",
    riskLevel: "Medium",
    recommendedSize: "Duo",
    description:
      "The sprawling Acerra Spaceport where Exodus shuttles once launched; a derelict trove of pre-Collapse technology with both surface and underground sections heavily guarded by ARC.",
    lootBias: ["Topside Material", "Refined Material"],
    topMaterials: ["ARC Powercell", "Mechanical Components", "Wires", "Metal Parts"],
    pois: [],
  },

  {
    name: "The Blue Gate",
    riskLevel: "High",
    recommendedSize: "Trio",
    description:
      "A mountainous valley with abandoned towns, fruiting orchards, and an underground ARC complex; the Locked Gate event extends the raid to 40 minutes with key-card gating on the highest-value loot.",
    lootBias: ["Topside Material", "Nature", "Refined Material"],
    topMaterials: ["Metal Parts", "Wires", "ARC Powercell", "Mechanical Components"],
    pois: [],
  },

  {
    name: "Riven Tides",
    riskLevel: "Extreme",
    recommendedSize: "Trio",
    description:
      "A twice-abandoned coastal harbor resort with exposed sight lines and a Stacking Yard puzzle that unlocks tiered loot rooms; Beachcombing condition adds Trinkets along the beach.",
    lootBias: ["Recyclable", "Trinket", "Basic Material"],
    topMaterials: ["Battery", "Wires", "Metal Parts"],
    pois: [
      {
        name: "Stacking Yard",
        riskLevel: "High",
        notes:
          "Multi-step puzzle requiring four hidden buttons plus a battery-powered lift to unlock two progressively better loot rooms; strong PvP magnet each raid.",
      },
    ],
  },

  {
    name: "Stella Montis",
    riskLevel: "High",
    recommendedSize: "Trio",
    description:
      "A sealed research facility carved into snow-draped mountain peaks north of the Rust Belt; limited documented map conditions (Night Raid only) and minimal wiki coverage as of June 2026.",
    lootBias: ["Refined Material", "Topside Material"],
    topMaterials: ["Advanced ARC Powercell", "Mechanical Components", "Metal Parts"],
    pois: [],
  },

  {
    name: "Practice Range",
    riskLevel: "Low",
    recommendedSize: "Solo",
    description:
      "A secluded mountain hollow where ARC navigation is disrupted by echoed gunfire, creating a safe 2-hour session for combat practice and skill tuning.",
    lootBias: [],
    topMaterials: [],
    pois: [],
  },
];
