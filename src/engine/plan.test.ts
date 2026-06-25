import { describe, it, expect } from "vitest";
import {
  materialsFromStash,
  requirementsForRecipe,
  shortfall,
  mapsByMaterial,
} from "./plan";
import type { Item, Recipe } from "./types";
import type { ArcMap } from "../data/maps";

const mat = (name: string, sellPrice: number): Item => ({
  name,
  category: "Basic Material",
  rarity: "Common",
  sellPrice,
  stackSize: 50,
  recycle: [],
});

const recyclable = (name: string, yields: { name: string; qty: number }[]): Item => ({
  name,
  category: "Recyclable",
  rarity: "Rare",
  sellPrice: 1000,
  stackSize: 3,
  recycle: yields,
});

const itemByName: Record<string, Item> = {
  "Metal Parts": mat("Metal Parts", 75),
  Battery: mat("Battery", 250),
  "Broken Flashlight": recyclable("Broken Flashlight", [
    { name: "Battery", qty: 2 },
    { name: "Metal Parts", qty: 6 },
  ]),
};

describe("materialsFromStash", () => {
  it("returns empty for empty stash", () => {
    expect(materialsFromStash([], itemByName)).toEqual({});
  });

  it("sums recycle yields × stash qty", () => {
    const result = materialsFromStash(
      [{ name: "Broken Flashlight", qty: 3 }],
      itemByName,
    );
    expect(result).toEqual({ Battery: 6, "Metal Parts": 18 });
  });

  it("skips items not found in the lookup", () => {
    const result = materialsFromStash(
      [{ name: "Unknownium", qty: 5 }],
      itemByName,
    );
    expect(result).toEqual({});
  });

  it("aggregates across multiple stash entries", () => {
    const itemByName2 = {
      ...itemByName,
      "Broken Taser": recyclable("Broken Taser", [{ name: "Battery", qty: 2 }]),
    };
    const result = materialsFromStash(
      [
        { name: "Broken Flashlight", qty: 1 },
        { name: "Broken Taser", qty: 2 },
      ],
      itemByName2,
    );
    expect(result).toEqual({ Battery: 2 + 4, "Metal Parts": 6 });
  });
});

const workbench: Recipe = {
  name: "Workbench Lv.2",
  category: "Hideout",
  needs: { "Mechanical Components": 4, "Metal Parts": 30 },
};

describe("requirementsForRecipe", () => {
  it("returns recipe needs verbatim for qty 1", () => {
    expect(requirementsForRecipe(workbench, 1)).toEqual({
      "Mechanical Components": 4,
      "Metal Parts": 30,
    });
  });

  it("scales every material by qty", () => {
    expect(requirementsForRecipe(workbench, 3)).toEqual({
      "Mechanical Components": 12,
      "Metal Parts": 90,
    });
  });

  it("handles qty 0", () => {
    expect(requirementsForRecipe(workbench, 0)).toEqual({
      "Mechanical Components": 0,
      "Metal Parts": 0,
    });
  });
});

describe("shortfall", () => {
  it("returns one PlanLine per required material", () => {
    const lines = shortfall(
      { "Metal Parts": 30, Battery: 4 },
      {},
    );
    expect(lines).toHaveLength(2);
    expect(lines.map((l) => l.material).sort()).toEqual(["Battery", "Metal Parts"]);
  });

  it("clamps `short` to zero when available exceeds need", () => {
    const lines = shortfall(
      { "Metal Parts": 10 },
      { "Metal Parts": 50 },
    );
    expect(lines[0]).toEqual({
      material: "Metal Parts",
      need: 10,
      have: 50,
      short: 0,
    });
  });

  it("computes short correctly when partially covered", () => {
    const lines = shortfall(
      { "Metal Parts": 30 },
      { "Metal Parts": 12 },
    );
    expect(lines[0]).toEqual({
      material: "Metal Parts",
      need: 30,
      have: 12,
      short: 18,
    });
  });

  it("treats missing-from-available as 0 have", () => {
    const lines = shortfall(
      { Battery: 5 },
      {},
    );
    expect(lines[0]).toEqual({
      material: "Battery",
      need: 5,
      have: 0,
      short: 5,
    });
  });
});

const makeMap = (name: string, topMaterials: string[]): ArcMap => ({
  name,
  riskLevel: "Medium",
  recommendedSize: "Duo",
  description: "test",
  lootBias: [],
  topMaterials,
  pois: [],
});

describe("mapsByMaterial", () => {
  it("returns maps whose topMaterials contains the material", () => {
    const maps = [
      makeMap("Buried City", ["Metal Parts", "Wires"]),
      makeMap("Spaceport", ["Bastion Cell", "Wires"]),
      makeMap("Dam", ["Industrial Battery", "Metal Parts"]),
    ];
    const result = mapsByMaterial("Metal Parts", maps);
    expect(result.map((m) => m.name)).toEqual(["Buried City", "Dam"]);
  });

  it("returns empty array when no map has the material", () => {
    const maps = [makeMap("Buried City", ["Metal Parts"])];
    expect(mapsByMaterial("Unknownium", maps)).toEqual([]);
  });

  it("is exact-match (no substring matching)", () => {
    const maps = [makeMap("Buried City", ["Metal Parts"])];
    expect(mapsByMaterial("Metal", maps)).toEqual([]);
  });
});
