import { describe, it, expect } from "vitest";
import { recycleValue, recommend } from "./recommend";
import type { Item, MaterialPrices } from "./types";

const prices: MaterialPrices = {
  "Metal Parts": 4,
  Gears: 12,
  Battery: 22,
};

const itemFactory = (recycle: Item["recycle"]): Item => ({
  id: "x",
  name: "Test",
  category: "Test",
  sell: 0,
  recycle,
});

describe("recycleValue", () => {
  it("sums price * qty across all recycle yields", () => {
    const item = itemFactory([
      { m: "Battery", q: 1 },
      { m: "Metal Parts", q: 2 },
    ]);
    expect(recycleValue(item, prices)).toBe(22 + 8);
  });

  it("returns 0 for an item with no recycle yields", () => {
    expect(recycleValue(itemFactory([]), prices)).toBe(0);
  });

  it("treats unknown materials as price 0", () => {
    const item = itemFactory([{ m: "Unknownium", q: 5 }]);
    expect(recycleValue(item, prices)).toBe(0);
  });
});

const recipeItem = (overrides: Partial<Item> = {}): Item => ({
  id: "ri",
  name: "Recipe Item",
  category: "Test",
  sell: 50,
  recycle: [
    { m: "Battery", q: 1 },
    { m: "Metal Parts", q: 2 },
  ],
  ...overrides,
});

describe("recommend", () => {
  it("returns KEEP when the item name itself is on the goal list", () => {
    const item = recipeItem();
    const rec = recommend(item, prices, [item.name]);
    expect(rec.action).toBe("KEEP");
    expect(rec.value).toBe(item.sell);
  });

  it("returns RECYCLE when one of the recycle materials is a goal", () => {
    const item = recipeItem();
    const rec = recommend(item, prices, ["Battery"]);
    expect(rec.action).toBe("RECYCLE");
    expect(rec.reason).toContain("Battery");
  });

  it("KEEP wins over RECYCLE when both apply (item name AND material both goals)", () => {
    const item = recipeItem();
    const rec = recommend(item, prices, [item.name, "Battery"]);
    expect(rec.action).toBe("KEEP");
  });

  it("returns RECYCLE when recycle value exceeds sell value", () => {
    const item = recipeItem({ sell: 5 });
    const rec = recommend(item, prices, []);
    expect(rec.action).toBe("RECYCLE");
    expect(rec.value).toBe(recycleValue(item, prices));
  });

  it("returns SELL when sell value exceeds recycle value", () => {
    const item = recipeItem({ sell: 999 });
    const rec = recommend(item, prices, []);
    expect(rec.action).toBe("SELL");
    expect(rec.value).toBe(999);
  });

  it("returns SELL on a tie (break-even)", () => {
    const sv = recycleValue(recipeItem(), prices);
    const item = recipeItem({ sell: sv });
    const rec = recommend(item, prices, []);
    expect(rec.action).toBe("SELL");
  });
});
