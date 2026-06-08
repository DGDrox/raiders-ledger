export interface RecycleYield {
  m: string;
  q: number;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  sell: number;
  recycle: RecycleYield[];
}

export type MaterialPrices = Record<string, number>;

export type Goal = string;

export type Action = "SELL" | "RECYCLE" | "KEEP";

export interface Recommendation {
  action: Action;
  reason: string;
  value: number;
}
