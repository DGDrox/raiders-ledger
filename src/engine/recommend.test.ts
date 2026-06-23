import { describe, it, expect } from "vitest";
import { recycleValue, recommend } from "./recommend";
import type { Item } from "./types";

const mat = (name: string, sellPrice: number): Item => ({
  name,
  category: "Basic Material",
  rarity: "Common",
  sellPrice,
  stackSize: 50,
  recycle: [],
});

const itemByName: Record<string, Item> = {
  "Metal Parts": mat("Metal Parts", 4),
  Gears: mat("Gears", 12),
  Battery: mat("Battery", 22),
};

const itemFactory = (recycle: Item["recycle"]): Item => ({
  name: "Test",
  category: "Recyclable",
  rarity: "Common",
  sellPrice: 0,
  stackSize: 1,
  recycle,
});

describe("recycleValue", () => {
  it("sums sellPrice * qty across all recycle yields", () => {
    const item = itemFactory([
      { name: "Battery", qty: 1 },
      { name: "Metal Parts", qty: 2 },
    ]);
    expect(recycleValue(item, itemByName)).toBe(22 + 8);
  });

  it("returns 0 for an item with no recycle yields", () => {
    expect(recycleValue(itemFactory([]), itemByName)).toBe(0);
  });

  it("treats unknown materials as price 0", () => {
    const item = itemFactory([{ name: "Unknownium", qty: 5 }]);
    expect(recycleValue(item, itemByName)).toBe(0);
  });
});

const recipeItem = (overrides: Partial<Item> = {}): Item => ({
  name: "Recipe Item",
  category: "Recyclable",
  rarity: "Rare",
  sellPrice: 50,
  stackSize: 3,
  recycle: [
    { name: "Battery", qty: 1 },
    { name: "Metal Parts", qty: 2 },
  ],
  ...overrides,
});

describe("recommend", () => {
  it("returns KEEP when the item name itself is on the goal list", () => {
    const item = recipeItem();
    const rec = recommend(item, itemByName, [item.name]);
    expect(rec.action).toBe("KEEP");
    expect(rec.value).toBe(item.sellPrice);
  });

  it("returns RECYCLE when one of the recycle materials is a goal", () => {
    const item = recipeItem();
    const rec = recommend(item, itemByName, ["Battery"]);
    expect(rec.action).toBe("RECYCLE");
    expect(rec.reason).toContain("Battery");
  });

  it("KEEP wins over RECYCLE when both apply (item name AND material both goals)", () => {
    const item = recipeItem();
    const rec = recommend(item, itemByName, [item.name, "Battery"]);
    expect(rec.action).toBe("KEEP");
  });

  it("returns RECYCLE when recycle value exceeds sell value", () => {
    const item = recipeItem({ sellPrice: 5 });
    const rec = recommend(item, itemByName, []);
    expect(rec.action).toBe("RECYCLE");
    expect(rec.value).toBe(recycleValue(item, itemByName));
  });

  it("returns SELL when sell value exceeds recycle value", () => {
    const item = recipeItem({ sellPrice: 999 });
    const rec = recommend(item, itemByName, []);
    expect(rec.action).toBe("SELL");
    expect(rec.value).toBe(999);
  });

  it("returns SELL on a tie (break-even)", () => {
    const sv = recycleValue(recipeItem(), itemByName);
    const item = recipeItem({ sellPrice: sv });
    const rec = recommend(item, itemByName, []);
    expect(rec.action).toBe("SELL");
  });
});
