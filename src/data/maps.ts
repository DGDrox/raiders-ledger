// Arc Raiders — Maps Database
// Source: arcraiders.wiki (scraped June 2026 via Cowork)
//   Map pages, quest pages, ARC unit pages (Sentinel, Leaper, Bastion, ARC Surveyor),
//   security-code item pages (Locked Gate), and key item pages.
//
// Coverage:
//   Maps                   : 7  (6 playable + Practice Range)
//   Total named POIs       : 50 (Dam 9 · Buried City 10 · Spaceport 10 ·
//                                Blue Gate 10 · Riven Tides 5 · Stella Montis 6 ·
//                                Practice Range 0)
//   POI source             : ARC unit spawn tables (Sentinel/Leaper/Bastion pages),
//                            quest objective text, key-item location pages
//
// topMaterials sourcing per map:
//   Dam Battlegrounds  — Controlled Access Zone item pool (wiki-confirmed)
//   Spaceport          — Bastion spawn pages (East/West Hangar, Launch Tower,
//                        Vehicle Maintenance) + Sentinel (South Trench Tower) +
//                        Leaper (South of Launch Towers)
//   The Blue Gate      — Leaper spawns (wiki-confirmed) + Bastion (Outer Gates) +
//                        Sentinel (Pilgrim's Peak) + Candleberries via Cold Snap /
//                        Olive Grove (both wiki-confirmed for this map)
//   Stella Montis      — Bastion (Loading Bay) + Sentinel (Atrium), both
//                        wiki-confirmed for Stella Montis specifically
//   Buried City        — Leaper + Bastion spawn pages list Buried City locations
//   Riven Tides        — No ARC unit spawn locations documented for Riven Tides
//                        on wiki as of June 2026; basic salvage items used
//
// recommendedSize: wiki does not publish per-map group size.
//   Inferred from difficulty: Low→Solo, Medium→Duo, High/Extreme→Trio.

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
  // ─── DAM BATTLEGROUNDS ───────────────────────────────────────────────────
  {
    name: "Dam Battlegrounds",
    riskLevel: "Low",
    recommendedSize: "Solo",
    description:
      "The Alcantara Power Plant — \"The Dam\" — bisects a toxic, waterlogged swampland of scarred forests and hydroponic domes. The beginner entry point with the broadest loot pool and a heavily-documented Controlled Access Zone puzzle unlocking the map's highest-value rewards.",
    lootBias: ["Basic Material", "Topside Material"],
    topMaterials: ["ARC Performance Steel", "Industrial Battery", "Leaper Pulse Unit", "Metal Parts", "Wires"],
    pois: [
      {
        name: "Controlled Access Zone",
        riskLevel: "Extreme",
        notes:
          "Added in 1.17.0; four-button switch puzzle plus a resource-deposit lock unlock two tiered loot rooms — the single highest-value endpoint on the map and a constant PvP flashpoint.",
      },
      {
        name: "Water Treatment Control",
        riskLevel: "High",
        notes:
          "Industrial water plant building with a locked room accessible only via the Dam Surveillance Key; Bastion patrols the elevator and open ground east of the building.",
      },
      {
        name: "Red Lakes",
        riskLevel: "High",
        notes:
          "Toxic elevated wetland bisecting the central map; a Bastion and Leaper both patrol the balcony and lower area, making it a dangerous but ARC-rich farming zone.",
      },
      {
        name: "The Breach",
        riskLevel: "Medium",
        notes:
          "The crumbling dam structure that splits the map north-to-south; Sentinel positions cover approaches from both sides, making it the map's main chokepoint crossing.",
      },
      {
        name: "Research & Administration",
        riskLevel: "Medium",
        notes:
          "ENELICA research and office complex with medical rooms and earthquake-resistance data; a Sentinel overlooks the south corner — quest anchor for Medical Merchandise and Paving The Way.",
      },
      {
        name: "Power Generation Complex",
        riskLevel: "Medium",
        notes:
          "ENELICA industrial building with heavy machinery; contains a notice board with research data and machinery that can be breached for Power Rods — quest anchor for Paving The Way and Tribute To Toledo.",
      },
      {
        name: "Hydroponic Domes",
        riskLevel: "Low",
        notes:
          "Ramshackle agricultural domes south of the dam; Nature-category items spawn here and a Leaper patrols southeast of the complex — low ARC density but steady foraging income.",
      },
      {
        name: "Formicai Outpost",
        riskLevel: "Low",
        notes:
          "Raider faction fortification north of the dam; a quest objective for A Symbol of Unification requiring a flag hoist — seldom contested outside of quest windows.",
      },
      {
        name: "Pattern House",
        riskLevel: "Low",
        notes:
          "Isolated structure far north of the dam; minimal ARC presence makes it a quiet loot stop, though its distance from extraction points adds extraction risk.",
      },
    ],
  },

  // ─── BURIED CITY ─────────────────────────────────────────────────────────
  {
    name: "Buried City",
    riskLevel: "Medium",
    recommendedSize: "Duo",
    description:
      "The sand-choked ruins of the pre-Collapse city of Marano, featuring tight alleys, sun-bleached rooftops ideal for traversal, and distinct districts — Old Town, City Center, and the Outskirts — each with their own loot profile.",
    lootBias: ["Basic Material", "Recyclable"],
    topMaterials: ["Metal Parts", "Wires", "Mechanical Components", "ARC Performance Steel"],
    pois: [
      {
        name: "Town Hall",
        riskLevel: "High",
        notes:
          "Prominent civic building with a Sentinel in the bell tower and another on the underpass south of it — strong loot inside but the Sentinel fire zones make open approaches lethal.",
      },
      {
        name: "Piazza Roma",
        riskLevel: "High",
        notes:
          "Central square featuring a Convinio shop and the Convinio Apartments above; quest anchor for Unexpected Initiative and Paving The Way — high Raider traffic and PvP pressure every raid.",
      },
      {
        name: "Market Ruins",
        riskLevel: "High",
        notes:
          "Open market district with a Bastion patrol in the ruins; heavy salvage potential from containers but the Bastion dominates the clearing and draws other Raiders hunting ARC drops.",
      },
      {
        name: "Hospital",
        riskLevel: "High",
        notes:
          "Medical facility with multiple exam room containers yielding high-quality medical loot; quest anchor for Medical Merchandise and A Reveal In Ruins — consistent PvP destination.",
      },
      {
        name: "Space Travel Building",
        riskLevel: "High",
        notes:
          "Tall multi-floor building with a barricaded area on floor 6; quest anchor for Greasing Her Palms — vertical combat and a worthwhile loot endpoint for teams willing to clear it.",
      },
      {
        name: "City Center",
        riskLevel: "Medium",
        notes:
          "Dense urban core district with overlapping building lines and rooftop routes; moderate ARC density and strong general loot make it a reliable mid-raid refill zone.",
      },
      {
        name: "Grandioso Apartments",
        riskLevel: "Medium",
        notes:
          "Tall apartment block with rooftop access and a Moisture Meter quest item; good vertical play for experienced Raiders navigating Buried City's roofscape.",
      },
      {
        name: "Marano Station",
        riskLevel: "Medium",
        notes:
          "Transit hub named after the city's original pre-Collapse name; kiosks near the station are quest objectives for The League — moderate loot and a natural map-crossing landmark.",
      },
      {
        name: "Parking Garage",
        riskLevel: "Medium",
        notes:
          "Multi-story concrete structure with a Raider Camp beneath it; quest anchor for What We Left Behind — solid structural loot, seldom heavily defended.",
      },
      {
        name: "Su Durante Warehouses",
        riskLevel: "Low",
        notes:
          "Industrial storage complex in the Outskirts; quest anchor for the Tian Wen chain (Marked For Death) — low ARC presence but a long run from central extraction points.",
      },
    ],
  },

  // ─── SPACEPORT ───────────────────────────────────────────────────────────
  {
    name: "Spaceport",
    riskLevel: "Medium",
    recommendedSize: "Duo",
    description:
      "The sprawling Acerra Spaceport where Exodus shuttles once launched; the map has both an extensive surface (hangars, launch tower, control tower) and an underground network, all heavily patrolled by ARC. Hidden Bunker extends the raid to 40 minutes and adds a four-button objective.",
    lootBias: ["Topside Material", "Refined Material"],
    topMaterials: ["Bastion Cell", "Sentinel Firing Core", "Leaper Pulse Unit", "Advanced ARC Powercell", "ARC Performance Steel"],
    pois: [
      {
        name: "Launch Tower",
        riskLevel: "Extreme",
        notes:
          "Massive vertical rocket launch structure; a Bastion patrols the base and the tower is the objective during the Launch Tower Loot map condition — the map's highest-value contested zone.",
      },
      {
        name: "East Hangar",
        riskLevel: "High",
        notes:
          "Large open hangar on the east side; Bastion patrols southwest of the structure — strong ARC material drops for teams that can safely engage the Bastion in the open floor.",
      },
      {
        name: "West Hangar",
        riskLevel: "High",
        notes:
          "Mirror of the East Hangar on the west side; Bastion patrol southwest — another reliable Bastion Cell farming spot and general salvage area.",
      },
      {
        name: "Control Tower",
        riskLevel: "High",
        notes:
          "Navigation hub requiring a Spaceport Control Tower Key; quest anchor for Lost In Transmission and A Lay Of The Land — the LiDAR scanner on the upper floors draws Raiders for key-based loot.",
      },
      {
        name: "South Trench Tower",
        riskLevel: "High",
        notes:
          "Elevated tower on the south trench wall; a Sentinel sits on the east corner overseeing the trench approaches — key loot behind the Spaceport Trench Tower Key, quest anchor for Switching The Supply and Turnabout.",
      },
      {
        name: "Underground Tunnels",
        riskLevel: "High",
        notes:
          "Extensive network below the Spaceport surface; home to valve controls, Filtration Systems, and a Staff Locker area — dense ARC presence and quest anchor for The Clean Dream, The Stench Of Corruption, and Switching The Supply.",
      },
      {
        name: "Rocket Assembly",
        riskLevel: "High",
        notes:
          "Industrial complex housing rocket thruster assemblies; quest objective for Greasing Her Palms — strong Topside Material loot from the machinery-dense environment.",
      },
      {
        name: "Departure Building",
        riskLevel: "Medium",
        notes:
          "Passenger terminal with medical exam rooms and a Medical Exam Room sub-area; quest anchor for Medical Merchandise and Prescriptions Of The Past — reliable medical loot.",
      },
      {
        name: "Arrival Building",
        riskLevel: "Medium",
        notes:
          "Arrival terminal with a top-floor Magnetic Decryptor point; quest anchor for Deciphering The Data — moderate loot, moderate ARC presence.",
      },
      {
        name: "Electrical Substation",
        riskLevel: "Low",
        notes:
          "Peripheral power facility south of the Spaceport; quest anchor for Power Out — low ARC density, primarily a quest stop rather than a loot destination.",
      },
    ],
  },

  // ─── THE BLUE GATE ───────────────────────────────────────────────────────
  {
    name: "The Blue Gate",
    riskLevel: "High",
    recommendedSize: "Trio",
    description:
      "A mountainous valley with abandoned towns, fruiting orchards, an underground ARC complex, and four distinct key-card objectives powering the Locked Gate event. The only map where Candleberries bushes are documented as a notable harvestable resource.",
    lootBias: ["Topside Material", "Nature", "Refined Material"],
    topMaterials: ["Candleberries", "Leaper Pulse Unit", "Bastion Cell", "Sentinel Firing Core", "ARC Performance Steel"],
    pois: [
      {
        name: "Underground Tunnels",
        riskLevel: "Extreme",
        notes:
          "The locked underground ARC complex beneath the valley; becomes the Locked Gate objective during that condition — highest ARC density on the map and home to the top-tier loot cache.",
      },
      {
        name: "Outer Gates",
        riskLevel: "High",
        notes:
          "Massive gate structure at the valley entrance; Bastion patrols the concrete beams and a Sentinel overlooks approaches from above — primary ARC material farming zone for organised teams.",
      },
      {
        name: "Pilgrim's Peak",
        riskLevel: "High",
        notes:
          "High-ground Communications Tower location; one of the four Locked Gate security codes spawns here and a Sentinel overlooks the peak — key strategic position with elevation advantage.",
      },
      {
        name: "Ancient Fort",
        riskLevel: "High",
        notes:
          "Ruined fortification in the valley; one of the four Locked Gate security codes spawns inside — heavy ARC presence defends the structure, making this a combat-heavy code location.",
      },
      {
        name: "Reinforced Reception",
        riskLevel: "High",
        notes:
          "Fortified reception area providing underground access; one of the four Locked Gate security codes; a Leaper guards the approach — the most dangerous code pickup point.",
      },
      {
        name: "Traffic Tunnel",
        riskLevel: "High",
        notes:
          "Armored vehicle patrol route near the Blue Gate Checkpoint; key-locked Patrol Cars inside yield unique loot — quest anchor for Armored Transports with guaranteed ARC resistance.",
      },
      {
        name: "Security Wing",
        riskLevel: "High",
        notes:
          "Underground security area accessible via Blue Gate Confiscation Room Key — premium locked-room loot for players who can secure the key from surface spawns.",
      },
      {
        name: "Raider's Refuge",
        riskLevel: "Medium",
        notes:
          "Established raider shelter in the valley; one of the four Locked Gate security codes; lower ARC density than other code locations — the safest of the four key-card pickups.",
      },
      {
        name: "Ruined Homestead",
        riskLevel: "Medium",
        notes:
          "Abandoned residential ruins on the valley floor; a Leaper patrols the area — moderate salvage and a reliable Leaper Pulse Unit farming spot for prepared teams.",
      },
      {
        name: "Olive Grove",
        riskLevel: "Low",
        notes:
          "Fruiting orchard zone; quest anchor for Bees! and the primary Candleberries harvest area during Cold Snap — minimal ARC presence makes it a safe foraging detour.",
      },
    ],
  },

  // ─── RIVEN TIDES ─────────────────────────────────────────────────────────
  {
    name: "Riven Tides",
    riskLevel: "Extreme",
    recommendedSize: "Trio",
    description:
      "A twice-abandoned coastal harbor resort; the newest playable map (added 1.26.0) with limited wiki documentation. Strong Trinket economy from the Beachcombing condition; Stacking Yard puzzle is the map's primary high-value objective.",
    lootBias: ["Recyclable", "Trinket", "Basic Material"],
    topMaterials: ["Metal Parts", "Wires", "Battery"],
    pois: [
      {
        name: "Stacking Yard",
        riskLevel: "High",
        notes:
          "Industrial dock area with a two-stage puzzle — four hidden buttons unlock the first loot room; a battery-powered lift repair unlocks a second, higher-value room below the right platform.",
      },
      {
        name: "Hotel",
        riskLevel: "Medium",
        notes:
          "Multi-floor Exodus-era harbor resort; room-keycard loot and kitchen staff areas referenced in Battening Down and Safe Harbor quests — strong general loot for a systematic clear.",
      },
      {
        name: "Underground Tunnels",
        riskLevel: "High",
        notes:
          "Hidden tunnel network beneath the map center; a reliable Mushroom item spawn location and presumably dense ARC presence — exact enemy composition not yet fully documented on wiki.",
      },
      {
        name: "Dried Riverbed",
        riskLevel: "Low",
        notes:
          "Exposed coastal channel; Mushroom items spawn along the banks — minimal ARC presence, primarily a foraging route between the hotel and the waterfront.",
      },
      {
        name: "Seawalls",
        riskLevel: "Low",
        notes:
          "Coastal defensive structures along the harbor edge; quest anchor for Shoring Up Defenses and Battening Down — transit zone with low loot density and good sightlines.",
      },
    ],
  },

  // ─── STELLA MONTIS ───────────────────────────────────────────────────────
  {
    name: "Stella Montis",
    riskLevel: "High",
    recommendedSize: "Trio",
    description:
      "A sealed pre-Exodus research facility carved into snow-draped mountain peaks; two-level layout (upper and lower) with active androids in the Robotic Sandbox and the only indoor map in the rotation. Limited conditions (Night Raid only as of June 2026).",
    lootBias: ["Refined Material", "Topside Material"],
    topMaterials: ["Bastion Cell", "Sentinel Firing Core", "Advanced ARC Powercell"],
    pois: [
      {
        name: "Atrium",
        riskLevel: "Extreme",
        notes:
          "Vast central open space with a Sentinel mounted to the ceiling — unavoidable crossing point for most routes through the facility; wiki-confirmed as the highest-danger zone in Stella Montis.",
      },
      {
        name: "Robotic Sandbox",
        riskLevel: "High",
        notes:
          "Active ARC research chamber containing functional androids and a rover (Sandbox A); quest anchor for Fragmented Logs and Snap And Salvage — dense ARC presence with high Refined Material yield.",
      },
      {
        name: "Loading Bay",
        riskLevel: "High",
        notes:
          "Supply dock managed by Su Durante; a Bastion patrols the bay — wiki-confirmed Bastion Cell drop location and the facility's primary heavy-ARC combat zone.",
      },
      {
        name: "Top Floor Storage",
        riskLevel: "High",
        notes:
          "Key-locked storage room on the east side of the top floor, opened with the Stella Montis Archives Key — premium loot cache with low foot traffic due to the key requirement.",
      },
      {
        name: "Cultural Archives",
        riskLevel: "Medium",
        notes:
          "Records and media storage area; quest anchor for Movie Night (movie tapes) — moderate ARC presence and solid general loot from the research-archive containers.",
      },
      {
        name: "Security Checkpoint",
        riskLevel: "Medium",
        notes:
          "Lobby entry area with key-locked doors including a Box Locker behind the Stella Montis Security Checkpoint Key — chokepoint between the surface entrance and deeper facility sections.",
      },
    ],
  },

  // ─── PRACTICE RANGE ──────────────────────────────────────────────────────
  {
    name: "Practice Range",
    riskLevel: "Low",
    recommendedSize: "Solo",
    description:
      "A secluded mountain hollow where ARC navigation is disrupted by echoed gunfire, creating a 2-hour safe zone for combat practice and skill tuning. Unlocked after 4 rounds.",
    lootBias: [],
    topMaterials: [],
    pois: [],
  },
];
