import type { Item, ItemCategory, Recipe } from "./types";
import type { StashEntry } from "../storage";
import type { ArcMap } from "../data/maps";

export function materialsFromStash(
  stash: StashEntry[],
  itemByName: Record<string, Item>,
): Record<string, number> {
  const acc: Record<string, number> = {};
  for (const s of stash) {
    const item = itemByName[s.name];
    if (!item) continue;
    for (const r of item.recycle) {
      acc[r.name] = (acc[r.name] ?? 0) + r.qty * s.qty;
    }
  }
  return acc;
}

export function requirementsForRecipe(
  recipe: Recipe,
  qty: number,
): Record<string, number> {
  const acc: Record<string, number> = {};
  for (const [m, n] of Object.entries(recipe.needs)) {
    acc[m] = n * qty;
  }
  return acc;
}

export interface PlanLine {
  material: string;
  need: number;
  have: number;
  short: number;
}

export function shortfall(
  required: Record<string, number>,
  available: Record<string, number>,
): PlanLine[] {
  return Object.entries(required).map(([material, need]) => {
    const have = available[material] ?? 0;
    return {
      material,
      need,
      have,
      short: Math.max(0, need - have),
    };
  });
}

export function mapsByMaterial(material: string, maps: ArcMap[]): ArcMap[] {
  return maps.filter((m) => m.topMaterials.includes(material));
}

export function mapsByCategory(category: ItemCategory, maps: ArcMap[]): ArcMap[] {
  return maps.filter((m) => m.lootBias.includes(category));
}
