import type { Goal } from "./engine/types";

const STORAGE_KEY = "raider_ledger_v1";

export interface StashEntry {
  name: string;
  qty: number;
}

export interface PersistedState {
  stash: StashEntry[];
  goals: Goal[];
}

function isValidStashEntry(e: unknown): e is StashEntry {
  return (
    typeof e === "object" &&
    e !== null &&
    typeof (e as StashEntry).name === "string" &&
    typeof (e as StashEntry).qty === "number"
  );
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { stash?: unknown; goals?: unknown };
    const stash =
      Array.isArray(parsed.stash) && parsed.stash.every(isValidStashEntry)
        ? (parsed.stash as StashEntry[])
        : [];
    const goals =
      Array.isArray(parsed.goals) && parsed.goals.every((g) => typeof g === "string")
        ? (parsed.goals as Goal[])
        : [];
    return { stash, goals };
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — session works in-memory.
  }
}
