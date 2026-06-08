import type { Item, MaterialPrices, Goal } from "./engine/types";

const STORAGE_KEY = "raider_ledger_v1";

export interface StashEntry {
  id: string;
  qty: number;
}

export interface PersistedState {
  items: Item[];
  materials: MaterialPrices;
  stash: StashEntry[];
  goals: Goal[];
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable (private mode on some browsers) —
    // session still works in-memory, so swallow.
  }
}
