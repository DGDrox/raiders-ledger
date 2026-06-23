import type { Item, Goal, Recommendation } from "./types";

export function recycleValue(
  item: Item,
  itemByName: Record<string, Item>,
): number {
  return item.recycle.reduce(
    (sum, r) => sum + (itemByName[r.name]?.sellPrice ?? 0) * r.qty,
    0,
  );
}

export function recommend(
  item: Item,
  itemByName: Record<string, Item>,
  goals: Goal[],
): Recommendation {
  const rv = recycleValue(item, itemByName);
  const sv = item.sellPrice;
  const yieldsGoal = item.recycle.find((r) => goals.includes(r.name));
  const keptForGoal = goals.includes(item.name);

  if (keptForGoal) return { action: "KEEP", reason: "On your goal list", value: sv };
  if (yieldsGoal) return { action: "RECYCLE", reason: `Yields ${yieldsGoal.name} you're farming`, value: rv };
  if (rv > sv) return { action: "RECYCLE", reason: `Materials worth ${rv}c vs ${sv}c sell`, value: rv };
  if (sv > rv) return { action: "SELL", reason: `${sv}c beats ${rv}c in scrap`, value: sv };
  return { action: "SELL", reason: "Sell and scrap break even", value: sv };
}
