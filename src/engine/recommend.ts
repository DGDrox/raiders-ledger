import type { Item, MaterialPrices, Goal, Recommendation } from "./types";

export function recycleValue(item: Item, materials: MaterialPrices): number {
  return item.recycle.reduce(
    (sum, r) => sum + (materials[r.m] ?? 0) * r.q,
    0,
  );
}

export function recommend(
  item: Item,
  materials: MaterialPrices,
  goals: Goal[],
): Recommendation {
  const rv = recycleValue(item, materials);
  const sv = item.sell;
  const yieldsGoal = item.recycle.find((r) => goals.includes(r.m));
  const keptForGoal = goals.includes(item.name);

  if (keptForGoal) return { action: "KEEP", reason: "On your goal list", value: sv };
  if (yieldsGoal) return { action: "RECYCLE", reason: `Yields ${yieldsGoal.m} you're farming`, value: rv };
  if (rv > sv) return { action: "RECYCLE", reason: `Materials worth ${rv}c vs ${sv}c sell`, value: rv };
  if (sv > rv) return { action: "SELL", reason: `${sv}c beats ${rv}c in scrap`, value: sv };
  return { action: "SELL", reason: "Sell and scrap break even", value: sv };
}
