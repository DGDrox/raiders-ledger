// Arc Raiders—inspired theme tokens.
// Shared by App.tsx and RunPlanner.tsx. Edit here to retheme the whole app.

import type { Rarity } from "../engine/types";

export const COLORS = {
  bg: "#0a0a0a",        // near-black, neutral
  panel: "#141414",     // dark surface
  panel2: "#1c1c1c",    // raised surface
  line: "#2a2a2a",      // borders/dividers
  amber: "#ff6b35",     // Arc Raiders signature orange
  amberDim: "#b04a23",  // darker orange for muted accents
  rust: "#ff3b30",      // danger/keep red
  green: "#00d97e",     // recycle / go signal
  text: "#f0f0f0",      // crisp off-white
  textDim: "#7a7a7a",   // neutral gray
};

export const RARITY_COLOR: Record<Rarity, string> = {
  Common: COLORS.textDim,
  Uncommon: COLORS.green,
  Rare: "#3aa6ff",       // brighter ARC blue
  Epic: "#c477ff",       // brighter purple
  Legendary: COLORS.amber,
};

// Header font: Tektur — angular geometric sci-fi, evokes Arc Raiders' UI logo.
// Body font: IBM Plex Mono — technical HUD feel.
export const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Tektur:wght@500;600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

export const HEADER_FONT = "'Tektur', 'Oswald', sans-serif";
export const BODY_FONT = "'IBM Plex Mono', monospace";
