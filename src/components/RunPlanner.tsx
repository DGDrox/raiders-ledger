import { useState, useMemo, type CSSProperties, type ReactNode } from "react";
import type { ItemCategory, Rarity, Recipe } from "../engine/types";
import {
  materialsFromStash,
  requirementsForRecipe,
  shortfall,
  mapsByMaterial,
  mapsByCategory,
  type PlanLine,
} from "../engine/plan";
import { ITEM_BY_NAME } from "../data/items";
import { RECIPES } from "../data/recipes";
import { MAPS } from "../data/maps";
import type { StashEntry } from "../storage";
import { COLORS, RARITY_COLOR, HEADER_FONT } from "../ui/theme";

// Practice Range is a training map — no loot, no relevance for planning.
const SELECTABLE_MAPS = MAPS.filter((m) => m.name !== "Practice Range");

const UPGRADE_PREFIX = "upgrade:";

// Categories you actually loot off the ground in a raid. Recipe ingredients
// outside this list (weapons, blueprints, augments, shields, mods, ammo, keys,
// quick-use, misc) get no "where to farm" entry — you craft them, not raid for them.
const FARMABLE_CATEGORIES: ItemCategory[] = [
  "Basic Material",
  "Topside Material",
  "Refined Material",
  "Recyclable",
  "Nature",
  "Trinket",
];

type PickerEntry =
  | { kind: "single"; key: string; label: string; recipe: Recipe }
  | { kind: "upgrade"; key: string; label: string; baseName: string; transitions: { label: string; recipe: Recipe }[] };

function buildPickerEntries(recipes: Recipe[]): PickerEntry[] {
  const upgradeGroups = new Map<string, { label: string; recipe: Recipe }[]>();
  const singles: PickerEntry[] = [];

  for (const r of recipes) {
    if (r.name.includes(" → ")) {
      // Weapon upgrade — name pattern "Ferro I → II"
      const [from, to] = r.name.split(" → ");
      const fromParts = from.split(" ");
      const fromTier = fromParts[fromParts.length - 1];
      const baseName = fromParts.slice(0, -1).join(" ");
      const transitionLabel = `${fromTier} → ${to}`;
      const existing = upgradeGroups.get(baseName) ?? [];
      existing.push({ label: transitionLabel, recipe: r });
      upgradeGroups.set(baseName, existing);
    } else {
      singles.push({ kind: "single", key: r.name, label: r.name, recipe: r });
    }
  }

  const upgrades: PickerEntry[] = Array.from(upgradeGroups.entries()).map(([baseName, transitions]) => ({
    kind: "upgrade",
    key: `${UPGRADE_PREFIX}${baseName}`,
    label: `${baseName} Upgrade`,
    baseName,
    transitions,
  }));

  return [...singles, ...upgrades].sort((a, b) => a.label.localeCompare(b.label));
}

export default function RunPlanner({ stash }: { stash: StashEntry[] }) {
  const pickerEntries = useMemo(() => buildPickerEntries(RECIPES), []);

  const [selectedKey, setSelectedKey] = useState<string>(pickerEntries[0].key);
  const [transitionIndex, setTransitionIndex] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);
  const [mapName, setMapName] = useState<string>(SELECTABLE_MAPS[0].name);

  const selectedEntry = useMemo(
    () => pickerEntries.find((e) => e.key === selectedKey) ?? pickerEntries[0],
    [selectedKey, pickerEntries],
  );

  const recipe = useMemo(() => {
    if (selectedEntry.kind === "single") return selectedEntry.recipe;
    const idx = Math.min(transitionIndex, selectedEntry.transitions.length - 1);
    return selectedEntry.transitions[idx].recipe;
  }, [selectedEntry, transitionIndex]);

  function onSelectKey(key: string) {
    setSelectedKey(key);
    setTransitionIndex(0); // reset to first transition when switching recipes
  }

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
  const farmList = plan.filter((p) => {
    if (p.short === 0) return false;
    const item = ITEM_BY_NAME[p.material];
    return !!item && FARMABLE_CATEGORIES.includes(item.category);
  });

  const selectedMap = SELECTABLE_MAPS.find((m) => m.name === mapName) ?? SELECTABLE_MAPS[0];

  return (
    <>
      <SectionLabel>Goal</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: COLORS.textDim }}>Build</span>
        <select
          value={selectedKey}
          onChange={(e) => onSelectKey(e.target.value)}
          style={{ ...selectStyle, flex: "1 1 150px" }}
        >
          {pickerEntries.map((e) => (
            <option key={e.key} value={e.key}>
              {e.label}
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
      {selectedEntry.kind === "upgrade" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: COLORS.textDim }}>From tier</span>
          <select
            value={transitionIndex}
            onChange={(e) => setTransitionIndex(+e.target.value)}
            style={{ ...selectStyle, flex: "1 1 150px" }}
          >
            {selectedEntry.transitions.map((t, i) => (
              <option key={t.label} value={i}>{t.label}</option>
            ))}
          </select>
        </div>
      )}
      {selectedEntry.kind === "single" && <div style={{ marginBottom: 8 }} />}

      <SectionLabel>Map</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <select
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          style={{ ...selectStyle, flex: "1 1 200px" }}
        >
          {SELECTABLE_MAPS.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

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
      ) : farmList.length > 0 ? (
        <>
          <SectionLabel>Where to farm</SectionLabel>
          {farmList.map((p) => (
            <FarmRecommendation
              key={p.material}
              material={p.material}
              short={p.short}
              mapFilter={selectedMap.name}
            />
          ))}
        </>
      ) : null}
    </>
  );
}

function PlanRow({ line }: { line: PlanLine }) {
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
          fontFamily: HEADER_FONT,
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
  const primary = mapsByMaterial(material, MAPS);
  const item = ITEM_BY_NAME[material];
  const secondary = item
    ? mapsByCategory(item.category, MAPS).filter((m) => !primary.includes(m))
    : [];
  const candidates = [...primary, ...secondary];
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
            ? `Not a documented drop on ${mapFilter}. Try another map.`
            : "No map data available for this material yet."}
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
        fontFamily: HEADER_FONT,
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
