// Arc Raiders — Craftable Recipes
// PLACEHOLDER values. The wiki has recipe data scattered across many pages
// (Hideout upgrades, Crafting); Cowork has not yet been asked to gather them.
// These 6 entries exist so v2 Run Planner is functional end-to-end.
// All material names MUST match a `name` in src/data/items.ts ITEMS.

import type { Recipe } from "../engine/types";

export const RECIPES: Recipe[] = [
  {
    name: "Workbench Lv.2",
    category: "Hideout",
    needs: { "Mechanical Components": 4, "Electrical Components": 2, "Metal Parts": 30 },
  },
  {
    name: "Med Station Lv.2",
    category: "Hideout",
    needs: { Chemicals: 30, "Electrical Components": 3, Antiseptic: 2 },
  },
  {
    name: "Stash Lv.2",
    category: "Hideout",
    needs: { "Metal Parts": 40, "Plastic Parts": 20, "Mechanical Components": 2 },
  },
  {
    name: "Reinforced Armor",
    category: "Combat",
    needs: { Fabric: 25, "Metal Parts": 10, "Durable Cloth": 4 },
  },
  {
    name: "Advanced Ammo Batch",
    category: "Crafted Item",
    needs: { "Metal Parts": 8, Chemicals: 2, "Crude Explosives": 1 },
  },
  {
    name: "Field Med Pack",
    category: "Crafted Item",
    needs: { Antiseptic: 2, Fabric: 5, Chemicals: 3 },
  },
];
