import { useState, useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import type { Item, Goal, Action, Rarity, ItemCategory } from "./engine/types";
import { recommend } from "./engine/recommend";
import { ITEMS, ITEM_BY_NAME } from "./data/items";
import { loadState, saveState, type StashEntry } from "./storage";

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

const ACTION_COLOR: Record<Action, string> = {
  SELL: COLORS.amber,
  RECYCLE: COLORS.green,
  KEEP: COLORS.rust,
};

const RARITY_COLOR: Record<Rarity, string> = {
  Common: COLORS.textDim,
  Uncommon: COLORS.green,
  Rare: "#5b8db8",
  Epic: "#a06fc4",
  Legendary: COLORS.amber,
};

const MATERIAL_CATEGORIES: ItemCategory[] = [
  "Basic Material",
  "Topside Material",
  "Refined Material",
];

const HOARDABLE_CATEGORIES: ItemCategory[] = [
  "Recyclable",
  "Trinket",
  "Quick Use",
  "Mods",
  "Augment",
  "Shield",
  "Nature",
  "Misc",
];

type TabId = "stash" | "goals";

const MAX_PICKER_ROWS = 40;

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

export default function App() {
  const [stash, setStash] = useState<StashEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tab, setTab] = useState<TabId>("stash");
  const [ready, setReady] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [goalSearch, setGoalSearch] = useState("");

  useEffect(() => {
    const s = loadState();
    if (s) {
      setStash(s.stash);
      setGoals(s.goals);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState({ stash, goals });
  }, [stash, goals, ready]);

  const stashRows = stash
    .map((s) => {
      const item = ITEM_BY_NAME[s.name];
      if (!item) return null;
      const rec = recommend(item, ITEM_BY_NAME, goals);
      return { ...s, item, rec, lineValue: rec.value * s.qty };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const totals = useMemo(() => {
    let optimized = 0;
    let sellAll = 0;
    stashRows.forEach((r) => {
      optimized += r.lineValue;
      sellAll += r.item.sellPrice * r.qty;
    });
    return { optimized, sellAll, gain: optimized - sellAll };
  }, [stashRows]);

  const pickerResults = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    const matches = q
      ? ITEMS.filter((i) => i.name.toLowerCase().includes(q))
      : ITEMS;
    return matches.slice(0, MAX_PICKER_ROWS);
  }, [pickerSearch]);

  function addToStash(name: string) {
    setStash((prev) => {
      const found = prev.find((p) => p.name === name);
      if (found) return prev.map((p) => (p.name === name ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { name, qty: 1 }];
    });
  }
  function removeStash(name: string) {
    setStash((p) => p.filter((s) => s.name !== name));
  }
  function bump(name: string, d: number) {
    setStash((p) => p.map((s) => (s.name === name ? { ...s, qty: Math.max(1, s.qty + d) } : s)));
  }
  function toggleGoal(name: string) {
    setGoals((g) => (g.includes(name) ? g.filter((x) => x !== name) : [...g, name]));
  }

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100vh",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <style>{FONT_IMPORT}</style>

      <div
        style={{
          padding: "18px 22px 14px",
          borderBottom: `1px solid ${COLORS.line}`,
          background: `linear-gradient(180deg, ${COLORS.panel}, ${COLORS.bg})`,
        }}
      >
        <div
          style={{
            fontFamily: "Oswald, sans-serif",
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: "0.04em",
            color: COLORS.text,
            lineHeight: 1,
          }}
        >
          RAIDER<span style={{ color: COLORS.amber }}>'</span>S LEDGER
        </div>
        <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 5, letterSpacing: "0.05em" }}>
          PROFIT ADVISOR · sell / recycle / keep · v1
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.line}`, background: COLORS.panel }}>
        <TabButton id="stash" tab={tab} setTab={setTab} label="Stash" />
        <TabButton id="goals" tab={tab} setTab={setTab} label="Goals" />
      </div>

      <div style={{ padding: 20 }}>
        {tab === "stash" && (
          <StashTab
            pickerSearch={pickerSearch}
            setPickerSearch={setPickerSearch}
            pickerResults={pickerResults}
            stashRows={stashRows}
            totals={totals}
            addToStash={addToStash}
            removeStash={removeStash}
            bump={bump}
          />
        )}

        {tab === "goals" && (
          <GoalsTab
            goals={goals}
            goalSearch={goalSearch}
            setGoalSearch={setGoalSearch}
            toggleGoal={toggleGoal}
          />
        )}
      </div>
    </div>
  );
}

function TabButton({
  id,
  tab,
  setTab,
  label,
}: {
  id: TabId;
  tab: TabId;
  setTab: (t: TabId) => void;
  label: string;
}) {
  const active = tab === id;
  return (
    <button
      onClick={() => setTab(id)}
      style={{
        fontFamily: "Oswald, sans-serif",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        fontSize: 13,
        fontWeight: 600,
        padding: "10px 18px",
        cursor: "pointer",
        background: active ? COLORS.panel2 : "transparent",
        color: active ? COLORS.amber : COLORS.textDim,
        border: "none",
        borderBottom: active ? `2px solid ${COLORS.amber}` : "2px solid transparent",
      }}
    >
      {label}
    </button>
  );
}

type StashRow = {
  name: string;
  qty: number;
  item: Item;
  rec: ReturnType<typeof recommend>;
  lineValue: number;
};

function StashTab({
  pickerSearch,
  setPickerSearch,
  pickerResults,
  stashRows,
  totals,
  addToStash,
  removeStash,
  bump,
}: {
  pickerSearch: string;
  setPickerSearch: (s: string) => void;
  pickerResults: Item[];
  stashRows: StashRow[];
  totals: { optimized: number; sellAll: number; gain: number };
  addToStash: (name: string) => void;
  removeStash: (name: string) => void;
  bump: (name: string, d: number) => void;
}) {
  return (
    <>
      <SectionLabel>Add to stash</SectionLabel>
      <input
        type="text"
        placeholder="Search items…"
        value={pickerSearch}
        onChange={(e) => setPickerSearch(e.target.value)}
        style={inputStyle}
      />
      <div
        style={{
          marginTop: 8,
          marginBottom: 16,
          maxHeight: 220,
          overflowY: "auto",
          border: `1px solid ${COLORS.line}`,
          borderRadius: 3,
          background: COLORS.panel,
        }}
      >
        {pickerResults.length === 0 && (
          <div style={{ padding: "12px 14px", fontSize: 12, color: COLORS.textDim, textAlign: "center" }}>
            No matches
          </div>
        )}
        {pickerResults.map((i) => (
          <button
            key={i.name}
            onClick={() => addToStash(i.name)}
            style={pickerRowStyle}
          >
            <RarityDot rarity={i.rarity} />
            <span style={{ flex: 1, textAlign: "left", fontSize: 13 }}>{i.name}</span>
            <span style={{ fontSize: 11, color: COLORS.textDim }}>{i.sellPrice}c</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <Stat label="Optimized take" value={`${totals.optimized}c`} color={COLORS.amber} />
        <Stat label="If you sold it all" value={`${totals.sellAll}c`} color={COLORS.textDim} />
        <Stat
          label="Smart-play gain"
          value={`${totals.gain >= 0 ? "+" : ""}${totals.gain}c`}
          color={totals.gain > 0 ? COLORS.green : COLORS.textDim}
        />
      </div>

      {stashRows.length === 0 && (
        <div
          style={{
            color: COLORS.textDim,
            fontSize: 13,
            textAlign: "center",
            padding: "30px 0",
            border: `1px dashed ${COLORS.line}`,
            borderRadius: 4,
          }}
        >
          Empty stash. Tap items above to add what you hauled out.
        </div>
      )}
      {stashRows.map((r) => (
        <div
          key={r.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            background: COLORS.panel,
            border: `1px solid ${COLORS.line}`,
            borderLeft: `3px solid ${ACTION_COLOR[r.rec.action]}`,
            borderRadius: 3,
            marginBottom: 8,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <RarityDot rarity={r.item.rarity} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {r.item.name}
              </span>
              <span style={{ color: COLORS.textDim, flexShrink: 0 }}>×{r.qty}</span>
            </div>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{r.rec.reason}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "Oswald, sans-serif",
                fontWeight: 700,
                letterSpacing: "0.1em",
                fontSize: 14,
                color: ACTION_COLOR[r.rec.action],
              }}
            >
              {r.rec.action}
            </div>
            <div style={{ fontSize: 12, color: COLORS.text }}>{r.lineValue}c</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <button onClick={() => bump(r.name, 1)} style={miniBtn} aria-label="Increase">+</button>
            <button onClick={() => bump(r.name, -1)} style={miniBtn} aria-label="Decrease">−</button>
          </div>
          <button
            onClick={() => removeStash(r.name)}
            style={{ ...miniBtn, color: COLORS.rust, width: 26 }}
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}
    </>
  );
}

function GoalsTab({
  goals,
  goalSearch,
  setGoalSearch,
  toggleGoal,
}: {
  goals: Goal[];
  goalSearch: string;
  setGoalSearch: (s: string) => void;
  toggleGoal: (name: string) => void;
}) {
  const q = goalSearch.trim().toLowerCase();

  const materials = useMemo(() => {
    const list = ITEMS.filter((i) => MATERIAL_CATEGORIES.includes(i.category));
    return q ? list.filter((i) => i.name.toLowerCase().includes(q)) : list;
  }, [q]);

  const hoardables = useMemo(() => {
    const list = ITEMS.filter((i) => HOARDABLE_CATEGORIES.includes(i.category));
    return q ? list.filter((i) => i.name.toLowerCase().includes(q)) : list.slice(0, 40);
  }, [q]);

  return (
    <>
      <p style={{ fontSize: 12, color: COLORS.textDim, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
        Flag materials you're farming or items you're hoarding. The advisor flips to KEEP / RECYCLE for anything that feeds a goal — so it never tells you to sell something you actually need.
      </p>

      <input
        type="text"
        placeholder="Search items or materials…"
        value={goalSearch}
        onChange={(e) => setGoalSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: 16 }}
      />

      <SectionLabel>Materials I'm farming</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {materials.length === 0 && <EmptyHint>No materials match "{q}"</EmptyHint>}
        {materials.map((i) => (
          <Chip
            key={i.name}
            active={goals.includes(i.name)}
            onClick={() => toggleGoal(i.name)}
            label={i.name}
          />
        ))}
      </div>

      <SectionLabel>
        Items I'm holding onto
        {!q && <span style={{ color: COLORS.textDim, fontWeight: 400, marginLeft: 8 }}>· showing first 40, search to find more</span>}
      </SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {hoardables.length === 0 && <EmptyHint>No items match "{q}"</EmptyHint>}
        {hoardables.map((i) => (
          <Chip
            key={i.name}
            active={goals.includes(i.name)}
            onClick={() => toggleGoal(i.name)}
            label={i.name}
          />
        ))}
      </div>
    </>
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

function EmptyHint({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 12, color: COLORS.textDim }}>{children}</div>;
}

const inputStyle: CSSProperties = {
  width: "100%",
  background: COLORS.panel2,
  color: COLORS.text,
  border: `1px solid ${COLORS.line}`,
  padding: "10px 12px",
  fontFamily: "inherit",
  fontSize: 13,
  borderRadius: 3,
  boxSizing: "border-box",
};

const pickerRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  padding: "10px 12px",
  background: "transparent",
  color: COLORS.text,
  border: "none",
  borderBottom: `1px solid ${COLORS.line}`,
  cursor: "pointer",
  fontFamily: "inherit",
  textAlign: "left",
};

const miniBtn: CSSProperties = {
  background: "transparent",
  color: "#998d7c",
  border: "1px solid #3a3027",
  width: 22,
  height: 18,
  fontSize: 12,
  lineHeight: 1,
  cursor: "pointer",
  borderRadius: 2,
  padding: 0,
};

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        flex: "1 1 110px",
        background: "#1d1813",
        border: "1px solid #3a3027",
        borderRadius: 3,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 10, color: "#998d7c", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 20, color, marginTop: 3 }}>{value}</div>
    </div>
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
        color: "#a87528",
        marginBottom: 10,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#e8a13a" : "#26201a",
        color: active ? "#14110d" : "#e7ddcf",
        border: `1px solid ${active ? "#e8a13a" : "#3a3027"}`,
        padding: "7px 12px",
        fontFamily: "inherit",
        fontSize: 12,
        cursor: "pointer",
        borderRadius: 3,
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}
