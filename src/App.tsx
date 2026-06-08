import { useState, useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import type { Item, MaterialPrices, Goal, Action } from "./engine/types";
import { recommend } from "./engine/recommend";
import { DEFAULT_ITEMS, DEFAULT_MATERIALS } from "./data/items";
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

type TabId = "stash" | "goals" | "db";

export default function App() {
  const [items, setItems] = useState<Item[]>(DEFAULT_ITEMS);
  const [materials, setMaterials] = useState<MaterialPrices>(DEFAULT_MATERIALS);
  const [stash, setStash] = useState<StashEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tab, setTab] = useState<TabId>("stash");
  const [ready, setReady] = useState(false);
  const [addSel, setAddSel] = useState<string>(DEFAULT_ITEMS[0].id);
  const [addQty, setAddQty] = useState(1);

  useEffect(() => {
    const s = loadState();
    if (s) {
      if (s.items) setItems(s.items);
      if (s.materials) setMaterials(s.materials);
      if (s.stash) setStash(s.stash);
      if (s.goals) setGoals(s.goals);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState({ items, materials, stash, goals });
  }, [items, materials, stash, goals, ready]);

  const itemById = useMemo(
    () => Object.fromEntries(items.map((i) => [i.id, i])) as Record<string, Item>,
    [items],
  );

  const stashRows = stash
    .map((s) => {
      const item = itemById[s.id];
      if (!item) return null;
      const rec = recommend(item, materials, goals);
      return { ...s, item, rec, lineValue: rec.value * s.qty };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const totals = useMemo(() => {
    let optimized = 0,
      sellAll = 0;
    stashRows.forEach((r) => {
      optimized += r.lineValue;
      sellAll += r.item.sell * r.qty;
    });
    return { optimized, sellAll, gain: optimized - sellAll };
  }, [stashRows]);

  function addToStash() {
    setStash((prev) => {
      const found = prev.find((p) => p.id === addSel);
      if (found) return prev.map((p) => (p.id === addSel ? { ...p, qty: p.qty + addQty } : p));
      return [...prev, { id: addSel, qty: addQty }];
    });
    setAddQty(1);
  }
  function removeStash(id: string) {
    setStash((p) => p.filter((s) => s.id !== id));
  }
  function bump(id: string, d: number) {
    setStash((p) => p.map((s) => (s.id === id ? { ...s, qty: Math.max(1, s.qty + d) } : s)));
  }
  function toggleGoal(name: string) {
    setGoals((g) => (g.includes(name) ? g.filter((x) => x !== name) : [...g, name]));
  }
  function editItem(id: string, field: "sell", val: number) {
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [field]: val } : i)));
  }
  function editMaterial(name: string, val: number) {
    setMaterials((m) => ({ ...m, [name]: val }));
  }

  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

  const Tab = ({ id, label }: { id: TabId; label: string }) => (
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
        background: tab === id ? COLORS.panel2 : "transparent",
        color: tab === id ? COLORS.amber : COLORS.textDim,
        border: "none",
        borderBottom: tab === id ? `2px solid ${COLORS.amber}` : "2px solid transparent",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100vh",
        fontFamily: "'IBM Plex Mono', monospace",
        overflow: "hidden",
      }}
    >
      <style>{fontImport}</style>

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
        <Tab id="stash" label="Stash" />
        <Tab id="goals" label="Goals" />
        <Tab id="db" label="Database" />
      </div>

      <div style={{ padding: 20 }}>
        {tab === "stash" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <select
                value={addSel}
                onChange={(e) => setAddSel(e.target.value)}
                style={{
                  flex: "1 1 140px",
                  background: COLORS.panel2,
                  color: COLORS.text,
                  border: `1px solid ${COLORS.line}`,
                  padding: "9px 10px",
                  fontFamily: "inherit",
                  fontSize: 13,
                  borderRadius: 3,
                }}
              >
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={addQty}
                onChange={(e) => setAddQty(Math.max(1, +e.target.value || 1))}
                style={{
                  width: 64,
                  background: COLORS.panel2,
                  color: COLORS.text,
                  border: `1px solid ${COLORS.line}`,
                  padding: "9px 10px",
                  fontFamily: "inherit",
                  fontSize: 13,
                  borderRadius: 3,
                }}
              />
              <button
                onClick={addToStash}
                style={{
                  background: COLORS.amber,
                  color: COLORS.bg,
                  border: "none",
                  padding: "9px 18px",
                  fontFamily: "Oswald, sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontSize: 13,
                  cursor: "pointer",
                  borderRadius: 3,
                }}
              >
                Add
              </button>
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
                Empty stash. Add what you hauled out and I'll tell you what to do with it.
              </div>
            )}
            {stashRows.map((r) => (
              <div
                key={r.id}
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
                  <div style={{ fontWeight: 500, fontSize: 14 }}>
                    {r.item.name} <span style={{ color: COLORS.textDim }}>×{r.qty}</span>
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
                  <button onClick={() => bump(r.id, 1)} style={miniBtn}>+</button>
                  <button onClick={() => bump(r.id, -1)} style={miniBtn}>−</button>
                </div>
                <button
                  onClick={() => removeStash(r.id)}
                  style={{ ...miniBtn, color: COLORS.rust, width: 26 }}
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </>
        )}

        {tab === "goals" && (
          <>
            <p style={{ fontSize: 12, color: COLORS.textDim, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
              Flag materials you're farming or items you're hoarding. The advisor flips to KEEP / RECYCLE for anything that feeds a goal — so it never tells you to sell something you actually need.
            </p>
            <SectionLabel>Materials I'm farming</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
              {Object.keys(materials).map((m) => (
                <Chip key={m} active={goals.includes(m)} onClick={() => toggleGoal(m)} label={m} />
              ))}
            </div>
            <SectionLabel>Items I'm holding onto</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {items.map((i) => (
                <Chip key={i.id} active={goals.includes(i.name)} onClick={() => toggleGoal(i.name)} label={i.name} />
              ))}
            </div>
          </>
        )}

        {tab === "db" && (
          <>
            <p style={{ fontSize: 12, color: COLORS.rust, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
              Every number here is a placeholder. Replace with real values from arcraiders.wiki. Your edits save automatically. This table IS the engine — the run planner and loadout tools will read the same data.
            </p>
            <SectionLabel>Material prices (coin / unit)</SectionLabel>
            <div style={{ marginBottom: 18 }}>
              {Object.entries(materials).map(([m, v]) => (
                <div
                  key={m}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 0",
                    borderBottom: `1px solid ${COLORS.line}`,
                  }}
                >
                  <span style={{ flex: 1, fontSize: 13 }}>{m}</span>
                  <input
                    type="number"
                    value={v}
                    onChange={(e) => editMaterial(m, +e.target.value || 0)}
                    style={dbInput}
                  />
                </div>
              ))}
            </div>
            <SectionLabel>Item sell values (coin)</SectionLabel>
            <div>
              {items.map((i) => (
                <div
                  key={i.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 0",
                    borderBottom: `1px solid ${COLORS.line}`,
                  }}
                >
                  <span style={{ flex: 1, fontSize: 13 }}>
                    {i.name}
                    <span style={{ color: COLORS.textDim, fontSize: 11 }}>
                      {" "}· recycle: {i.recycle.map((r) => `${r.q} ${r.m}`).join(", ")}
                    </span>
                  </span>
                  <input
                    type="number"
                    value={i.sell}
                    onChange={(e) => editItem(i.id, "sell", +e.target.value || 0)}
                    style={dbInput}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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

const dbInput: CSSProperties = {
  width: 70,
  background: "#26201a",
  color: "#e7ddcf",
  border: "1px solid #3a3027",
  padding: "6px 8px",
  fontFamily: "inherit",
  fontSize: 13,
  borderRadius: 3,
  textAlign: "right",
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
