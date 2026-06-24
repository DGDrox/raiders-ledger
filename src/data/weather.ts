// Arc Raiders — Map Conditions / Weather Database
// Source: arcraiders.wiki (scraped June 2026 via Cowork)
//
// Coverage:
//   16 conditions total — 1 base, 5 major, 8 minor, 2 event-major (map-exclusive)
//   The wiki has no standalone "Weather" page; weather is part of the Map
//   Conditions system (wiki/Maps#Map_conditions).
//   "Normal" is the unmodified base state.
//
// Map-exclusive conditions reference these map names:
//   Spaceport       — Hidden Bunker, Launch Tower Loot
//   The Blue Gate   — Locked Gate
//   Buried City     — Bird City
//   Riven Tides     — Beachcombing
//
// Types are co-located here (not in engine/types.ts) because the v1 engine
// doesn't consume weather data — v2 Run Planner / v3 Loadout Evaluator will.

export type WeatherEffectType =
  | "visibility"
  | "pvp_density"
  | "arc_aggression"
  | "loot_quality"
  | "movement"
  | "stealth";

export type WeatherEffectDirection =
  | "increased"
  | "decreased"
  | "much_increased"
  | "much_decreased";

export interface WeatherEffect {
  type: WeatherEffectType;
  direction: WeatherEffectDirection;
  note?: string;
}

export interface Weather {
  name: string;
  description: string;
  effects: WeatherEffect[];
  advisorHint: string;
}

export const WEATHER: Weather[] = [
  // ── BASE ─────────────────────────────────────────────────────────────────
  {
    name: "Normal",
    description:
      "The default unmodified state of a map — standard ARC density, standard loot pools, and all Return Points and Raider Hatches active.",
    effects: [],
    advisorHint: "Baseline conditions — run any loadout; good for learning map layouts and routes.",
  },

  // ── MAJOR CONDITIONS ─────────────────────────────────────────────────────
  {
    name: "Night Raid",
    description:
      "Raiders operate under darkness with higher-value loot behind locked doors and more plentiful keys, but heightened ARC spawns, fewer Return Points, and no active Raider Hatches create severe extraction pressure. Free Loadout is disabled.",
    effects: [
      { type: "visibility", direction: "decreased", note: "Night-time darkness across the map" },
      { type: "stealth", direction: "increased", note: "Darkness aids concealment" },
      { type: "loot_quality", direction: "much_increased", note: "Higher rarity in containers; locked rooms more rewarding; better ARC drops (Advanced ARC Powercell, Bastion Cell, etc.)" },
      { type: "arc_aggression", direction: "much_increased", note: "Increased ARC spawn rates and density near high-value loot" },
      { type: "pvp_density", direction: "increased", note: "Fewer Return Points and no Raider Hatches force longer routes and extend player contact time" },
    ],
    advisorHint:
      "Highest loot upside in the game — bring a full trio, prioritize key-locked rooms, and plan extraction routes before dropping in.",
  },

  {
    name: "Electromagnetic Storm",
    description:
      "Intense lightning barrages the surface, dealing damage and briefly stunning any ARC or Raider struck; crashed Probes and Couriers are more plentiful. Fewer Return Points and no Raider Hatches active. Fossilized Lightning can spawn at strike sites.",
    effects: [
      { type: "loot_quality", direction: "increased", note: "More crashed Probes and Couriers; Fossilized Lightning spawns at strike sites (recycles to Explosive Compound)" },
      { type: "arc_aggression", direction: "decreased", note: "Large ARC disabled while stunned; small ARC can be instantly destroyed by strikes" },
    ],
    advisorHint:
      "Watch the blue ground glow before each strike and use stunned ARC windows aggressively — a prime run for farming Topside Materials and Fossilized Lightning.",
  },

  {
    name: "Cold Snap",
    description:
      "A cold front blankets the map in snow. Exposed Raiders suffer continuous frostbite damage, ice makes footing treacherous, and vision is reduced — but Candleberry bushes ripen and loot value increases.",
    effects: [
      { type: "visibility", direction: "decreased", note: "Snow reduces sightlines" },
      { type: "movement", direction: "decreased", note: "Slippery ice on frozen water surfaces" },
      { type: "loot_quality", direction: "increased", note: "Increased container value; ripe Candleberries available" },
    ],
    advisorHint:
      "Stay indoors or heal frequently — frostbite kills fast in the open; great for Nature farming if you can manage exposure.",
  },

  {
    name: "Hurricane",
    description:
      "Strong winds sweep across the surface, reducing visibility and hearing. Moving against the wind drains stamina and slows movement; jumping carries you with the wind. Debris chips at shields. First Wave Caches surface with Tier 4 weapons and rare blueprints, and more ARC are drawn in.",
    effects: [
      { type: "visibility", direction: "decreased", note: "Wind and debris reduce sightlines and audio" },
      { type: "stealth", direction: "increased", note: "High wind noise masks movement sounds" },
      { type: "movement", direction: "decreased", note: "Stamina drains faster moving against wind; throwables are wind-affected" },
      { type: "loot_quality", direction: "much_increased", note: "First Wave Caches surface with Tier 4 weapons and rare blueprints" },
      { type: "arc_aggression", direction: "increased", note: "More ARC drawn to the surface by Raider activity" },
    ],
    advisorHint:
      "High-reward run — hunt First Wave Caches along debris fields, move with the wind to preserve stamina, and expect heavy ARC contact.",
  },

  {
    name: "Close Scrutiny",
    description:
      "An ARC Operation: groups of Surveyors and Vaporizers actively scan for valuable materials across the map, guarding high-value discoveries.",
    effects: [
      { type: "arc_aggression", direction: "much_increased", note: "Coordinated Surveyor and Vaporizer patrols in addition to normal ARC" },
      { type: "loot_quality", direction: "increased", note: "ARC discoveries yield better loot if you can take it from them" },
    ],
    advisorHint:
      "ARC Operation — bring combat-oriented loadouts; the Surveyor/Vaporizer patrols are concentrated threats, not spread out.",
  },

  {
    name: "Hidden Bunker",
    description:
      "A hacked Outskirts Bunker at Spaceport with four buttons to unlock tiered loot rooms; raid duration extends to 40 minutes. Exclusive to Spaceport.",
    effects: [
      { type: "loot_quality", direction: "much_increased", note: "Bunker interior holds top-tier loot behind the button puzzle" },
      { type: "pvp_density", direction: "much_increased", note: "All Raiders converge on the same bunker — extreme PvP pressure at the objective" },
    ],
    advisorHint:
      "Spaceport only — rush the four buttons as a trio; solo attempts inside the bunker are extremely high-risk.",
  },

  {
    name: "Locked Gate",
    description:
      "An emergency shutdown at The Blue Gate requires 4 key cards to override; raid duration extends to 40 minutes. Exclusive to The Blue Gate.",
    effects: [
      { type: "loot_quality", direction: "much_increased", note: "Gate interior conceals top-tier loot behind the key-card sequence" },
      { type: "pvp_density", direction: "much_increased", note: "Key cards spawn around the map, forcing aggressive Raider confrontation" },
    ],
    advisorHint:
      "The Blue Gate only — prioritize key card collection before other Raiders; this is the highest-PvP condition on the map.",
  },

  // ── MINOR CONDITIONS ─────────────────────────────────────────────────────
  {
    name: "Lush Blooms",
    description:
      "Unusually agreeable weather causes plants and fruits to thrive across the map, boosting the availability of Nature-category items.",
    effects: [
      { type: "loot_quality", direction: "increased", note: "Nature items spawn in greater frequency and quantity" },
    ],
    advisorHint: "Best condition for Nature item farming — prioritize outdoor areas and vegetation clusters.",
  },

  {
    name: "Bird City",
    description:
      "Flocks of birds have gathered around the chimneys of Buried City for reasons unknown. Exclusive to Buried City.",
    effects: [],
    advisorHint: "No documented gameplay modifier — treat as a normal run on Buried City.",
  },

  {
    name: "Beachcombing",
    description:
      "Scouts report trinkets and small finds buried in the sands around Riven Tides, with \"a few less welcome things\" mixed in; a Dockmaster's Detector helps uncover them. Exclusive to Riven Tides.",
    effects: [
      { type: "loot_quality", direction: "increased", note: "Trinkets and buried finds along the beach; some hidden threats present" },
    ],
    advisorHint:
      "Riven Tides only — bring a Dockmaster's Detector and sweep the beach zones for Trinkets early in the raid.",
  },

  {
    name: "Prospecting Probes",
    description:
      "ARC enters an extended probing phase, sending heavily guarded probe clusters down en masse.",
    effects: [
      { type: "arc_aggression", direction: "much_increased", note: "High density of escorted ARC probes across the map" },
      { type: "loot_quality", direction: "increased", note: "Destroyed probes yield valuable materials" },
    ],
    advisorHint:
      "Combat-heavy run — target guarded probes for Topside Material drops, but be prepared for sustained ARC engagement.",
  },

  {
    name: "Husk Graveyard",
    description:
      "A mysterious event has caused large numbers of ARC machines to shut down spontaneously, leaving husks scattered across the Topside for salvage.",
    effects: [
      { type: "arc_aggression", direction: "decreased", note: "Many ARC units are already disabled and pose no threat" },
      { type: "loot_quality", direction: "increased", note: "ARC husks yield parts and information when salvaged" },
    ],
    advisorHint:
      "Low-pressure loot run — systematically salvage husks for Topside Materials with minimal ARC resistance.",
  },

  {
    name: "Uncovered Caches",
    description:
      "Storms have unearthed old Raider Caches across the map, but they are rigged to explode if left exposed too long — claim them quickly.",
    effects: [
      { type: "loot_quality", direction: "increased", note: "Extra Raider Caches spawn at surface dig sites" },
      { type: "pvp_density", direction: "increased", note: "Visible caches attract all Raiders to the same surface spots" },
    ],
    advisorHint:
      "Time-sensitive — locate caches immediately on drop and expect heavy PvP competition at each site.",
  },

  {
    name: "Launch Tower Loot",
    description:
      "Someone has stashed loot at the top of Spaceport's Launch Tower and locked it down; ARC defenses around the tower are heightened. Exclusive to Spaceport.",
    effects: [
      { type: "loot_quality", direction: "increased", note: "High-value loot concentrated at the top of the Launch Tower" },
      { type: "arc_aggression", direction: "increased", note: "Heavier ARC presence around the Launch Tower in response to activity" },
      { type: "pvp_density", direction: "increased", note: "Single high-value objective draws all Raiders to one location" },
    ],
    advisorHint:
      "Spaceport only — race to the Launch Tower top; vertical mobility tools give a decisive edge.",
  },

  {
    name: "Harvester",
    description:
      "A mysterious ARC Harvesting machine has appeared on the map, defended by the feared Queen and her escort.",
    effects: [
      { type: "arc_aggression", direction: "much_increased", note: "Queen and heavy escort present at the Harvester; highest ARC threat level in a minor condition" },
      { type: "loot_quality", direction: "much_increased", note: "Harvester contains premium loot if the Queen can be defeated" },
    ],
    advisorHint:
      "Treat this as a boss encounter — coordinate a trio assault on the Queen before other Raiders arrive at the Harvester.",
  },

  {
    name: "Matriarch",
    description:
      "A Matriarch ARC unit has been sighted in the area, defended aggressively by her offspring.",
    effects: [
      { type: "arc_aggression", direction: "much_increased", note: "Matriarch and dense offspring patrols blanket the map around her location" },
      { type: "loot_quality", direction: "increased", note: "Matriarch drops high-value loot on defeat" },
    ],
    advisorHint:
      "Locate and kill the Matriarch as a team before engaging other Raiders — her offspring are persistent even if you disengage.",
  },
];
