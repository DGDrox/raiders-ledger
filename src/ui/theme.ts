// Arc Raiders—inspired theme tokens.
// Retro-futuristic 70s sci-fi: deep midnight navy backgrounds, cream off-white
// text, warm vintage orange, and the iconic rainbow stripe accent.
//
// Shared by App.tsx and RunPlanner.tsx. Edit here to retheme the whole app.

import type { Rarity } from "../engine/types";

export const COLORS = {
  bg: "#0d1726",        // deep midnight navy (matches the key art's space sky)
  panel: "#152135",     // slightly raised navy
  panel2: "#1d2c44",    // higher surface
  line: "#2e425e",      // navy border
  amber: "#ff8a4c",     // warm vintage orange (cream-shifted from the brand)
  amberDim: "#c46838",  // muted orange
  rust: "#e84d3d",      // rusty red (KEEP)
  green: "#48cba1",     // retro teal-green (RECYCLE)
  text: "#f4ecd9",      // cream / off-white (matches the logo color)
  textDim: "#8a9bb5",   // muted blue-gray
};

// Iconic Arc Raiders rainbow stripe gradient — red → orange → yellow → green → cyan → blue.
export const RAINBOW_GRADIENT =
  "linear-gradient(90deg, #e84d3d 0%, #ff8a4c 20%, #f5d24d 40%, #48cba1 60%, #4596d1 80%, #6b6ce0 100%)";

export const RARITY_COLOR: Record<Rarity, string> = {
  Common: COLORS.textDim,
  Uncommon: COLORS.green,
  Rare: "#4596d1",       // ARC blue
  Epic: "#c477ff",       // purple
  Legendary: COLORS.amber,
};

// Header font: Bowlby One — bold rounded geometric, matches the ARC Raiders logo.
// Body font: IBM Plex Mono — technical HUD feel.
export const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Bowlby+One&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

export const HEADER_FONT = "'Bowlby One', 'Oswald', sans-serif";
export const BODY_FONT = "'IBM Plex Mono', monospace";
