# v2 Run Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the parked v2 Run Planner prototype (`docs/prototypes/run-planner-v2.jsx`) into a real Planner tab on the live app, using the v1.5 schema and the maps + weather data layers we've already built.

**Architecture:** v2 is a new top-level tab ("Planner") in `App.tsx`, rendered by a new `src/components/RunPlanner.tsx` component. The decision logic lives in a new pure engine module `src/engine/plan.ts` with full test coverage. Recipes are seeded as placeholders in `src/data/recipes.ts` (wiki recipe data wasn't gathered by Cowork). Planner consumes the v1 stash directly via props — read-only, no new persistence.

**Tech Stack:** Vite + React 18 + TypeScript (strict) + Vitest. Same stack as v1. No new dependencies.

**Source of truth:** The parked prototype at `docs/prototypes/run-planner-v2.jsx`. Read it for shape and intent, but **the schema has drifted** — see "Schema drift" notes below.

**Out of scope for this plan:** Real recipe data from Cowork (use placeholders), v3 Loadout Evaluator, persisting Planner state (recipe/qty/context are session-only), recipe editing UI.

---

## Schema drift from the parked prototype

v1.5 changed the data shapes. The parked v2 prototype is written against the v1 placeholder schema. Translate on port:

| Old (parked prototype) | New (v1.5) |
|------------------------|------------|
| `item.id` | `item.name` (name is the primary key) |
| `item.sell` | `item.sellPrice` |
| `item.recycle: [{m, q}]` | `item.recycle: [{name, qty}]` |
| Separate `MaterialPrices` map | Materials are items with category `"Basic Material"` / `"Topside Material"` / `"Refined Material"` |
| `stash: [{id, qty}]` | `stash: [{name, qty}]` |
| `ZONES` table (hardcoded zone → material) | `MAPS` array (real data, `topMaterials[]` per map) |

Engine functions take the items lookup by name (`Record<string, Item>`) and the maps array directly. No materials map needed.

---

## File Structure

Files this plan creates (paths relative to `C:\Users\DG_Drox\Test\raiders-ledger\`):

| Path | Responsibility |
|------|---------------|
| `src/data/recipes.ts` | Placeholder craftable recipes (6 entries) |
| `src/engine/plan.ts` | Pure planning functions (`requirementsForRecipe`, `materialsFromStash`, `shortfall`, `mapsByMaterial`) |
| `src/engine/plan.test.ts` | Vitest tests for the engine |
| `src/components/RunPlanner.tsx` | Planner tab UI component |

Files modified:

| Path | What changes |
|------|--------------|
| `src/engine/types.ts` | Add `Recipe` type |
| `src/App.tsx` | Add `"planner"` to `TabId`, add tab button, render `<RunPlanner stash={stash} />` |

Files not touched: `src/data/items.ts`, `src/data/maps.ts`, `src/data/weather.ts`, `src/engine/recommend.ts`, `src/storage.ts`.

---

## Task 1: Recipe data

**Files:**
- Create: `src/data/recipes.ts`
- Modify: `src/engine/types.ts`

The parked prototype hardcoded 4 craftable goals. We extend that to 6, all referencing materials that exist in `ITEMS`. Recipe data is acknowledged placeholder — flagged clearly in the file header.

- [ ] **Step 1: Add `Recipe` type to `src/engine/types.ts`**

Append after the existing `Recommendation` interface:

```ts
export type RecipeCategory = "Hideout" | "Combat" | "Crafted Item";

export interface Recipe {
  name: string;
  category: RecipeCategory;
  // material name → quantity needed for 1 craft
  needs: Record<string, number>;
}
```

- [ ] **Step 2: Create `src/data/recipes.ts`**

```ts
// Arc Raiders — Craftable Recipes
// PLACEHOLDER values. The wiki has recipe data scattered across many pages
// (Hideout upgrades, Crafting); Cowork has not yet been asked to gather them.
// These 6 entries exist so v2 Run Planner is functional end-to-end.
// All material names MUST match a `name` in src/data/items.ts ITEMS.

import type { Recipe } from "../engine/types";

export const RECIPES: Recipe[] = [
  {
    name: "Workbench Lv.2",
    category: "Hideout",
    needs: { "Mechanical Components": 4, "Electrical Components": 2, "Metal Parts": 30 },
  },
  {
    name: "Med Station Lv.2",
    category: "Hideout",
    needs: { Chemicals: 30, "Electrical Components": 3, Antiseptic: 2 },
  },
  {
    name: "Stash Lv.2",
    category: "Hideout",
    needs: { "Metal Parts": 40, "Plastic Parts": 20, "Mechanical Components": 2 },
  },
  {
    name: "Reinforced Armor",
    category: "Combat",
    needs: { Fabric: 25, "Metal Parts": 10, "Durable Cloth": 4 },
  },
  {
    name: "Advanced Ammo Batch",
    category: "Crafted Item",
    needs: { "Metal Parts": 8, Chemicals: 2, "Crude Explosives": 1 },
  },
  {
    name: "Field Med Pack",
    category: "Crafted Item",
    needs: { Antiseptic: 2, Fabric: 5, Chemicals: 3 },
  },
];
```

- [ ] **Step 3: Build to verify types compile**

```bash
npm run build
```
Expected: build passes.

- [ ] **Step 4: Commit**

```bash
git add src/data/recipes.ts src/engine/types.ts
git commit -m "data: placeholder recipe data + Recipe type"
```

---

## Task 2: Planning engine (TDD)

**Files:**
- Create: `src/engine/plan.ts`, `src/engine/plan.test.ts`

Four pure functions:
- `materialsFromStash(stash, itemByName)` — sum recyclable yields from current stash
- `requirementsForRecipe(recipe, qty)` — scale recipe needs by quantity
- `shortfall(required, available)` — diff into per-material `PlanLine` rows
- `mapsByMaterial(material, maps)` — filter maps where `topMaterials.includes(material)`

TDD per function: write failing test, run red, implement, run green.

- [ ] **Step 1: Write `src/engine/plan.test.ts` with `materialsFromStash` tests**

```ts
import { describe, it, expect } from "vitest";
import { materialsFromStash } from "./plan";
import type { Item } from "./types";

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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL with `Failed to resolve import "./plan"`.

- [ ] **Step 3: Create `src/engine/plan.ts` with `materialsFromStash`**

```ts
import type { Item } from "./types";
import type { StashEntry } from "../storage";

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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: 4 passed (the `materialsFromStash` block) + 9 prior `recommend` tests = 13 total.

- [ ] **Step 5: Append `requirementsForRecipe` tests to `src/engine/plan.test.ts`**

Append to the file (before the final closing line):

```ts
import { requirementsForRecipe } from "./plan";
import type { Recipe } from "./types";

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
```

- [ ] **Step 6: Run tests — new ones should fail**

```bash
npm test
```
Expected: 3 new tests fail (`requirementsForRecipe is not exported`).

- [ ] **Step 7: Append `requirementsForRecipe` to `src/engine/plan.ts`**

Append (do not replace `materialsFromStash`):

```ts
import type { Recipe } from "./types";

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
```

- [ ] **Step 8: Run tests — all should pass**

```bash
npm test
```
Expected: 7 plan tests pass + 9 recommend = 16 total.

- [ ] **Step 9: Append `shortfall` tests**

Append to `src/engine/plan.test.ts`:

```ts
import { shortfall } from "./plan";

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
```

- [ ] **Step 10: Run tests — new ones fail**

```bash
npm test
```
Expected: 4 new tests fail.

- [ ] **Step 11: Implement `shortfall` in `src/engine/plan.ts`**

Append:

```ts
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
```

- [ ] **Step 12: Run tests — all pass**

```bash
npm test
```
Expected: 11 plan tests + 9 recommend = 20 total.

- [ ] **Step 13: Append `mapsByMaterial` tests**

Append:

```ts
import { mapsByMaterial } from "./plan";
import type { ArcMap } from "../data/maps";

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
```

- [ ] **Step 14: Run tests — new ones fail**

```bash
npm test
```
Expected: 3 new tests fail.

- [ ] **Step 15: Implement `mapsByMaterial` in `src/engine/plan.ts`**

Append:

```ts
import type { ArcMap } from "../data/maps";

export function mapsByMaterial(material: string, maps: ArcMap[]): ArcMap[] {
  return maps.filter((m) => m.topMaterials.includes(material));
}
```

- [ ] **Step 16: Run tests — all pass**

```bash
npm test
```
Expected: 14 plan tests + 9 recommend = 23 total.

- [ ] **Step 17: Commit**

```bash
git add src/engine/plan.ts src/engine/plan.test.ts
git commit -m "engine: planning module (materialsFromStash, requirementsForRecipe, shortfall, mapsByMaterial) with TDD"
```

---

## Task 3: RunPlanner UI component

**Files:**
- Create: `src/components/RunPlanner.tsx`

The component takes the current stash as a prop (passed down from `App.tsx`), manages its own selection state (recipe, qty, map filter, weather filter), and renders the plan + recommendations.

Inline styles, same color tokens (`COLORS`) and fonts as `src/App.tsx`. Visual language matches v1.

- [ ] **Step 1: Create `src/components/` directory if it doesn't exist**

```bash
mkdir -p src/components
```

- [ ] **Step 2: Write `src/components/RunPlanner.tsx`**

```tsx
import { useState, useMemo, type CSSProperties, type ReactNode } from "react";
import type { Item, Rarity } from "../engine/types";
import {
  materialsFromStash,
  requirementsForRecipe,
  shortfall,
  mapsByMaterial,
} from "../engine/plan";
import { ITEM_BY_NAME } from "../data/items";
import { RECIPES } from "../data/recipes";
import { MAPS } from "../data/maps";
import { WEATHER } from "../data/weather";
import type { StashEntry } from "../storage";

const COLORS = {
  bg: "#14110d",
  panel: "#1d1813",
  panel2: "#26201a",
  line: "#3a3027",
  amber: "#e8a13a",
  amberDim: "#a87528",
  rust: "#c0563a",
  green: "#7fa650",
  text: "#e7ddcf",
  textDim: "#998d7c",
};

const RARITY_COLOR: Record<Rarity, string> = {
  Common: COLORS.textDim,
  Uncommon: COLORS.green,
  Rare: "#5b8db8",
  Epic: "#a06fc4",
  Legendary: COLORS.amber,
};

const ANY_MAP = "__any__";
const ANY_WEATHER = "__any__";

export default function RunPlanner({ stash }: { stash: StashEntry[] }) {
  const [recipeName, setRecipeName] = useState<string>(RECIPES[0].name);
  const [qty, setQty] = useState<number>(1);
  const [mapName, setMapName] = useState<string>(ANY_MAP);
  const [weatherName, setWeatherName] = useState<string>(ANY_WEATHER);

  const recipe = useMemo(
    () => RECIPES.find((r) => r.name === recipeName) ?? RECIPES[0],
    [recipeName],
  );

  const available = useMemo(
    () => materialsFromStash(stash, ITEM_BY_NAME),
    [stash],
  );

  const required = useMemo(
    () => requirementsForRecipe(recipe, qty),
    [recipe, qty],
  );

  const plan = useMemo(() => shortfall(required, available), [required, available]);

  const fullyCovered = plan.every((p) => p.short === 0);
  const farmList = plan.filter((p) => p.short > 0);

  const selectedMap = mapName === ANY_MAP ? null : MAPS.find((m) => m.name === mapName) ?? null;
  const selectedWeather = weatherName === ANY_WEATHER ? null : WEATHER.find((w) => w.name === weatherName) ?? null;

  return (
    <>
      <SectionLabel>Goal</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: COLORS.textDim }}>Build</span>
        <select
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          style={{ ...selectStyle, flex: "1 1 150px" }}
        >
          {RECIPES.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: COLORS.textDim }}>×</span>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, +e.target.value || 1))}
          style={{ ...inputStyle, width: 64 }}
        />
      </div>

      <SectionLabel>Planning for (optional)</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <select
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          style={{ ...selectStyle, flex: "1 1 140px" }}
        >
          <option value={ANY_MAP}>Any map</option>
          {MAPS.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          value={weatherName}
          onChange={(e) => setWeatherName(e.target.value)}
          style={{ ...selectStyle, flex: "1 1 140px" }}
        >
          <option value={ANY_WEATHER}>Any condition</option>
          {WEATHER.map((w) => (
            <option key={w.name} value={w.name}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {selectedWeather && (
        <div
          style={{
            background: COLORS.panel,
            border: `1px solid ${COLORS.line}`,
            borderLeft: `3px solid ${COLORS.amber}`,
            borderRadius: 3,
            padding: "10px 12px",
            marginBottom: 16,
            fontSize: 12,
            color: COLORS.textDim,
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: COLORS.amber, fontWeight: 600 }}>{selectedWeather.name}: </span>
          {selectedWeather.advisorHint}
        </div>
      )}

      <SectionLabel>Materials</SectionLabel>
      <div style={{ marginBottom: 18 }}>
        {plan.map((p) => (
          <PlanRow key={p.material} line={p} />
        ))}
      </div>

      {fullyCovered ? (
        <div
          style={{
            background: COLORS.panel,
            border: `1px solid ${COLORS.line}`,
            borderLeft: `3px solid ${COLORS.green}`,
            borderRadius: 3,
            padding: "14px 16px",
            fontSize: 13,
            color: COLORS.green,
          }}
        >
          Your stash covers this. Recycle the relevant items and craft — no raid needed.
        </div>
      ) : (
        <>
          <SectionLabel>Where to farm</SectionLabel>
          {farmList.map((p) => (
            <FarmRecommendation
              key={p.material}
              material={p.material}
              short={p.short}
              mapFilter={selectedMap?.name ?? null}
            />
          ))}
        </>
      )}
    </>
  );
}

function PlanRow({ line }: { line: { material: string; need: number; have: number; short: number } }) {
  const item = ITEM_BY_NAME[line.material];
  const covered = line.short === 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: COLORS.panel,
        border: `1px solid ${COLORS.line}`,
        borderLeft: `3px solid ${covered ? COLORS.green : COLORS.rust}`,
        borderRadius: 3,
        marginBottom: 6,
      }}
    >
      {item && <RarityDot rarity={item.rarity} />}
      <div style={{ flex: 1, fontSize: 13 }}>{line.material}</div>
      <div style={{ fontSize: 11, color: COLORS.textDim }}>
        have <span style={{ color: COLORS.text }}>{line.have}</span> /{" "}
        need <span style={{ color: COLORS.text }}>{line.need}</span>
      </div>
      <div
        style={{
          width: 60,
          textAlign: "right",
          fontFamily: "Oswald, sans-serif",
          fontWeight: 700,
          fontSize: 13,
          color: covered ? COLORS.green : COLORS.rust,
        }}
      >
        {covered ? "SET" : `−${line.short}`}
      </div>
    </div>
  );
}

function FarmRecommendation({
  material,
  short,
  mapFilter,
}: {
  material: string;
  short: number;
  mapFilter: string | null;
}) {
  const candidates = mapsByMaterial(material, MAPS);
  const maps = mapFilter ? candidates.filter((m) => m.name === mapFilter) : candidates;

  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 3,
        padding: "12px 14px",
        marginBottom: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14, color: COLORS.text }}>{material}</div>
        <div style={{ fontSize: 11, color: COLORS.rust, fontWeight: 600 }}>need {short}</div>
      </div>
      {maps.length === 0 && (
        <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.5 }}>
          {mapFilter
            ? `Not documented as a top drop on ${mapFilter}. Try another map.`
            : "No map currently lists this in its top drops."}
        </div>
      )}
      {maps.map((m) => (
        <div key={m.name} style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${COLORS.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, fontSize: 13, color: COLORS.text, fontWeight: 500 }}>{m.name}</div>
            <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {m.riskLevel} · {m.recommendedSize}
            </div>
          </div>
          {m.pois.length > 0 && (
            <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4, lineHeight: 1.5 }}>
              POIs: {m.pois.slice(0, 3).map((p) => p.name).join(", ")}
              {m.pois.length > 3 && ` +${m.pois.length - 3} more`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RarityDot({ rarity }: { rarity: Rarity }) {
  return (
    <span
      aria-label={rarity}
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: RARITY_COLOR[rarity],
        flexShrink: 0,
      }}
    />
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Oswald, sans-serif",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        fontSize: 12,
        color: COLORS.amberDim,
        marginBottom: 10,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

const inputStyle: CSSProperties = {
  background: COLORS.panel2,
  color: COLORS.text,
  border: `1px solid ${COLORS.line}`,
  padding: "9px 10px",
  fontFamily: "inherit",
  fontSize: 13,
  borderRadius: 3,
  boxSizing: "border-box",
};

const selectStyle: CSSProperties = {
  background: COLORS.panel2,
  color: COLORS.text,
  border: `1px solid ${COLORS.line}`,
  padding: "9px 10px",
  fontFamily: "inherit",
  fontSize: 13,
  borderRadius: 3,
};

void Item; // type-only import keeps tree-shaker honest with strict noUnusedLocals; remove when used directly
```

Notes on the component:
- Imports `Item` purely for the rarity lookup type — the trailing `void Item;` keeps strict `noUnusedLocals` from complaining without changing behavior. If TS still flags it, change the import to `import type { Rarity } from "../engine/types"` only and remove the `Item` import + the `void` line.
- The "Where to farm" section only renders when `farmList.length > 0`. When `fullyCovered` is true, a single green panel appears instead.
- `mapFilter` from the optional context picker narrows farm recommendations to a single map. When it's `"Any map"` (the default), all candidate maps are shown.
- Weather selection just surfaces the advisor hint as a banner. The engine doesn't filter on weather in v2 — that's v3 territory.

- [ ] **Step 3: Run build to verify types**

```bash
npm run build
```
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/components/RunPlanner.tsx
git commit -m "ui: RunPlanner component with goal picker, context, plan, farm recommendations"
```

---

## Task 4: Wire Planner into App.tsx

**Files:**
- Modify: `src/App.tsx`

Three edits: extend `TabId`, add a tab button, render the component for the new tab.

- [ ] **Step 1: Modify `TabId` in `src/App.tsx`**

Find:
```ts
type TabId = "stash" | "goals";
```

Replace with:
```ts
type TabId = "stash" | "goals" | "planner";
```

- [ ] **Step 2: Add the Planner tab button**

Find the existing tab row:
```tsx
<div style={{ display: "flex", borderBottom: `1px solid ${COLORS.line}`, background: COLORS.panel }}>
  <TabButton id="stash" tab={tab} setTab={setTab} label="Stash" />
  <TabButton id="goals" tab={tab} setTab={setTab} label="Goals" />
</div>
```

Replace with:
```tsx
<div style={{ display: "flex", borderBottom: `1px solid ${COLORS.line}`, background: COLORS.panel }}>
  <TabButton id="stash" tab={tab} setTab={setTab} label="Stash" />
  <TabButton id="goals" tab={tab} setTab={setTab} label="Goals" />
  <TabButton id="planner" tab={tab} setTab={setTab} label="Planner" />
</div>
```

- [ ] **Step 3: Render the Planner when selected**

At the top of `src/App.tsx`, add the import alongside the others:
```ts
import RunPlanner from "./components/RunPlanner";
```

Then in the tab body, after the existing `tab === "goals"` block, add:
```tsx
{tab === "planner" && <RunPlanner stash={stash} />}
```

The full tab body section should now look like:
```tsx
<div style={{ padding: 20 }}>
  {tab === "stash" && (
    <StashTab ... />
  )}
  {tab === "goals" && (
    <GoalsTab ... />
  )}
  {tab === "planner" && <RunPlanner stash={stash} />}
</div>
```

- [ ] **Step 4: Run build + tests**

```bash
npm run build && npm test
```
Expected: build passes, 23 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "ui: wire Planner tab into App"
```

---

## Task 5: Verify locally + push

Build passing isn't sufficient — the UI must work end-to-end at mobile viewport.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```
Run with `run_in_background: true`. Note the URL (typically `http://localhost:5173/`).

- [ ] **Step 2: Drive the app at mobile viewport (390×844)**

Use Playwright MCP:
1. Navigate to `http://localhost:5173/`.
2. Tap the **Planner** tab.
3. Verify: the default recipe ("Workbench Lv.2") loads, qty defaults to 1, both context dropdowns default to "Any map" / "Any condition."
4. Verify the **Materials** breakdown shows 3 rows (Mechanical Components, Electrical Components, Metal Parts) with the expected need values (4, 2, 30).
5. Tap the recipe dropdown, switch to "Advanced Ammo Batch." Verify materials switch to (Metal Parts 8, Chemicals 2, Crude Explosives 1).
6. Bump qty to 3. Verify the need values triple (Metal Parts 24, Chemicals 6, Crude Explosives 3).
7. Pick **Spaceport** in the map filter. Verify the "Where to farm" section shrinks to recommendations for Spaceport only (or shows "Not documented as a top drop on Spaceport" for materials Spaceport doesn't list).
8. Pick **Hurricane** in the weather. Verify the amber advisor-hint banner appears with the Hurricane text.
9. Switch back to "Any map" / "Any condition." Verify the banner disappears and all candidate maps reappear.
10. Switch to the **Stash** tab. Verify the existing v1 UI still works (the Planner refactor must not have broken v1).

If any step fails, fix in `src/components/RunPlanner.tsx` or `src/App.tsx`, restart dev server, retry.

- [ ] **Step 3: Stop the dev server**

Kill the background bash task.

- [ ] **Step 4: Push**

```bash
git push origin main
```

Vercel auto-deploys (~30s).

- [ ] **Step 5: Verify production**

Navigate Playwright to `https://raiders-ledger.vercel.app/` at mobile viewport. Confirm the Planner tab is present and the flow from Step 2 (#3 — recipe load) works.

If production is broken but local was fine, check the deploy logs in Vercel.

---

## Definition of done

- `npm run build` succeeds.
- `npm test` passes (23 tests: 9 recommend + 14 plan).
- Local dev server renders Stash, Goals, Planner tabs at mobile viewport.
- Recipe selection updates the materials breakdown.
- Stash coverage (when present) shows green "SET" badges; shortfall shows red `−N` badges.
- Map filter narrows farm recommendations to one map.
- Weather selection surfaces an advisor-hint banner.
- All 5 commits land on `main`, pushed to `origin`.
- Production at https://raiders-ledger.vercel.app/ shows the Planner tab.

## Self-review notes

- Spec coverage:
  - Recipe data → Task 1 ✓
  - Stash-yields-via-recycling → Task 2 (`materialsFromStash`) ✓
  - Shortfall calc → Task 2 (`shortfall`) ✓
  - Maps by material → Task 2 (`mapsByMaterial`) ✓
  - Recipe picker UI → Task 3 ✓
  - Map + weather context picker → Task 3 ✓
  - Materials breakdown with stash coverage → Task 3 (`PlanRow`) ✓
  - Where-to-farm with POIs → Task 3 (`FarmRecommendation`) ✓
  - Tab wiring → Task 4 ✓
- Placeholder scan: every code step has full code, every command has expected output. No TBDs.
- Type consistency: `PlanLine.material` / `PlanLine.need` / `PlanLine.have` / `PlanLine.short` used identically across `plan.ts`, `plan.test.ts`, and `RunPlanner.tsx`. `ArcMap` imported from `../data/maps` in both engine and UI. `RECIPES` and `MAPS` and `WEATHER` referenced by their actual export names.
- Risks noted:
  - `void Item;` in RunPlanner is a TS strictness escape hatch — if it errors, the fallback is to drop the `Item` import entirely.
  - Production verify (Task 5 Step 5) depends on Vercel's GitHub link, which was set up earlier. If broken, redeploy via `vercel --prod`.
