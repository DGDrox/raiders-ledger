export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export type ItemCategory =
  | "Weapon"
  | "Shield"
  | "Augment"
  | "Ammunition"
  | "Quick Use"
  | "Mods"
  | "Key"
  | "Basic Material"
  | "Topside Material"
  | "Refined Material"
  | "Recyclable"
  | "Nature"
  | "Trinket"
  | "Misc"
  | "Blueprint";

export interface RecycleYield {
  name: string;
  qty: number;
}

export interface Item {
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  sellPrice: number;
  stackSize: number;
  recycle: RecycleYield[];
}

export interface Weapon {
  name: string;
  type: string;
}

export type Goal = string;

export type Action = "SELL" | "RECYCLE" | "KEEP";

export interface Recommendation {
  action: Action;
  reason: string;
  value: number;
}

export type RecipeCategory = "Hideout" | "Combat" | "Crafted Item";

export interface Recipe {
  name: string;
  category: RecipeCategory;
  // material name → quantity needed for 1 craft
  needs: Record<string, number>;
}
