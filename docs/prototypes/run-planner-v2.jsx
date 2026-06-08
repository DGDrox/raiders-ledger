// PARKED PROTOTYPE — v2 Run Planner
// Status: not yet ported. Waiting until v1 is deployed and used in the field.
// When you come back: see docs/superpowers/plans/ for the v2 port plan, or ask
// Claude Code to "port the run planner per docs/prototypes/run-planner-v2.jsx".
//
// Key design points carried over from the chat handoff:
//   - Reads the SAME storage key as v1 ("raider_ledger_v1") — consumes v1 state
//     without v1 needing to know v2 exists.
//   - Has FALLBACK_ITEMS / FALLBACK_STASH so it runs standalone for demo.
//   - GOALS (craftables) and ZONES (loot zone associations) are new data
//     tables — extract these into src/data/goals.ts on port.
//   - Pure logic worth extracting + testing: materialsFromStash (available),
//     recycleSuggestions, runPlan (gap calculation).
//   - UI: remove the ✓ glyph (no emoji rule). The ① ② circled numerals are
//     decorative — replace with "1." "2." on port. The ▸ caret is fine.
//   - Navigation decision: top-level tab switcher in App.tsx (Ledger | Planner),
//     no react-router. Decided 2026-06-08.

import React, { useState, useEffect, useMemo } from "react";

// ============================================================================
// RUN PLANNER — v2 lens on the Raider's Ledger engine
// ----------------------------------------------------------------------------
// Question: "What should I go get?"
// It reads the SAME state the Profit Advisor wrote (stash + item DB, via the
// shared storage key), so a "RECYCLE" call there becomes "recycle this, it feeds
// your goal" here. That's the payoff of one-engine-three-lenses: the tools talk.
//
// Flow:  pick a goal -> materials it needs -> subtract what your stash can yield
//        -> shortfall -> map each shortfall to its best farming zone -> raid plan.
//
// DATA NOTE: recipes + zone guidance are placeholders, but the zone associations
// are grounded in real Arc Raiders loot logic (factories=tech/gears, military=
// metal/weapon parts, residential=fabric/valuables). Replace recipe amounts with
// real wiki data. Stash + material prices come from the Ledger automatically.
// ============================================================================

const LEDGER_KEY = "raider_ledger_v1"; // shared with the Profit Advisor

const C = {
  bg: "#14110d", panel: "#1d1813", panel2: "#26201a", line: "#3a3027",
  amber: "#e8a13a", amberDim: "#a87528", rust: "#c0563a", green: "#7fa650",
  text: "#e7ddcf", textDim: "#998d7c",
};

// Fallback data if the Ledger hasn't been used yet (so this runs standalone too)
const FALLBACK_ITEMS = [
  { id: "i1", name: "Old Battery", recycle: [{ m: "Battery", q: 1 }, { m: "Metal Parts", q: 2 }] },
  { id: "i3", name: "Circuit Board", recycle: [{ m: "Electronic Components", q: 2 }] },
  { id: "i4", name: "Toolbox", recycle: [{ m: "Toolset", q: 1 }, { m: "Metal Parts", q: 3 }] },
  { id: "i6", name: "Weapon Parts", recycle: [{ m: "Metal Parts", q: 4 }, { m: "Gears", q: 1 }] },
  { id: "i8", name: "Sewing Kit", recycle: [{ m: "Fabric", q: 3 }] },
];
const FALLBACK_STASH = [{ id: "i1", qty: 3 }, { id: "i4", qty: 1 }, { id: "i6", qty: 2 }];

// Placeholder craftables. Replace amounts with real recipe data.
const GOALS = [
  { id: "g1", name: "Workbench Lv.2", needs: { Gears: 4, "Electronic Components": 2, "Metal Parts": 6 } },
  { id: "g2", name: "Reinforced Armor", needs: { Fabric: 5, "Metal Parts": 4, Toolset: 1 } },
  { id: "g3", name: "Med Station Lv.2", needs: { Chemicals: 6, "Electronic Components": 3 } },
  { id: "g4", name: "Advanced Ammo Batch", needs: { "Metal Parts": 8, Chemicals: 2 } },
];

// Where each material is best farmed — grounded in real ARC loot-zone logic.
const ZONES = {
  "Metal Parts": { zone: "Military / scrap sites", tip: "Heavy resistance — expect PvP" },
  Gears: { zone: "Industrial — factories & warehouses", tip: "Dense, low-risk farm" },
  "Electronic Components": { zone: "Industrial — factories", tip: "Check workbenches & shelving" },
  Battery: { zone: "Industrial — warehouses", tip: "Also drops from some ARC units" },
  Chemicals: { zone: "Labs & medical blocks", tip: "Overlaps with med farms" },
  Fabric: { zone: "Residential — houses & apartments", tip: "Quiet, good for solo" },
  Toolset: { zone: "Industrial — warehouses", tip: "Less common, prioritize toolboxes" },
};

export default function RunPlanner() {
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const [stash, setStash] = useState(FALLBACK_STASH);
  const [usingLedger, setUsingLedger] = useState(false);
  const [goalId, setGoalId] = useState(GOALS[0].id);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await window.storage.get(LEDGER_KEY);
        if (alive && res && res.value) {
          const s = JSON.parse(res.value);
          if (s.items && s.items.length) { setItems(s.items); setUsingLedger(true); }
          if (s.stash) setStash(s.stash);
        }
      } catch (e) { /* no ledger yet — fallbacks stand */ }
    })();
    return () => { alive = false; };
  }, []);

  const itemById = useMemo(() => Object.fromEntries(items.map((i) => [i.id, i])), [items]);
  const goal = GOALS.find((g) => g.id === goalId);

  // materials your current stash could yield by recycling
  const available = useMemo(() => {
    const acc = {};
    stash.forEach((s) => {
      const it = itemById[s.id];
      if (!it || !it.recycle) return;
      it.recycle.forEach((r) => { acc[r.m] = (acc[r.m] || 0) + r.q * s.qty; });
    });
    return acc;
  }, [stash, itemById]);

  // which stash items are worth recycling toward this goal
  const recycleSuggestions = useMemo(() => {
    const needed = new Set(Object.keys(goal.needs));
    return stash
      .map((s) => itemById[s.id])
      .filter((it) => it && it.recycle && it.recycle.some((r) => needed.has(r.m)))
      .map((it) => {
        const qtyHeld = stash.find((s) => s.id === it.id).qty;
        const relevant = it.recycle.filter((r) => needed.has(r.m)).map((r) => `${r.q * qtyHeld} ${r.m}`);
        return { name: it.name, qty: qtyHeld, gives: relevant.join(", ") };
      });
  }, [goal, stash, itemById]);

  // gap after recycling stash, scaled by qty
  const plan = useMemo(() => {
    return Object.entries(goal.needs).map(([m, perUnit]) => {
      const need = perUnit * qty;
      const have = available[m] || 0;
      const short = Math.max(0, need - have);
      return { m, need, have, short, zone: ZONES[m] };
    });
  }, [goal, qty, available]);

  const fullyCovered = plan.every((p) => p.short === 0);
  const farmList = plan.filter((p) => p.short > 0);

  const fonts = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: 540, fontFamily: "'IBM Plex Mono', monospace", borderRadius: 6, overflow: "hidden", border: `1px solid ${C.line}` }}>
      <style>{fonts}</style>

      <div style={{ padding: "18px 22px 14px", borderBottom: `1px solid ${C.line}`, background: `linear-gradient(180deg, ${C.panel}, ${C.bg})` }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.04em", lineHeight: 1 }}>
          RUN <span style={{ color: C.amber }}>PLANNER</span>
        </div>
        <div style={{ fontSize: 11, color: C.textDim, marginTop: 5, letterSpacing: "0.05em" }}>
          {usingLedger ? "▸ reading your live stash from the Ledger" : "▸ demo stash (use the Ledger to feed real data)"}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* goal picker */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: C.textDim }}>I want to build</span>
          <select value={goalId} onChange={(e) => setGoalId(e.target.value)}
            style={{ flex: "1 1 150px", background: C.panel2, color: C.text, border: `1px solid ${C.line}`, padding: "9px 10px", fontFamily: "inherit", fontSize: 13, borderRadius: 3 }}>
            {GOALS.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <span style={{ fontSize: 13, color: C.textDim }}>×</span>
          <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value || 1))}
            style={{ width: 56, background: C.panel2, color: C.text, border: `1px solid ${C.line}`, padding: "9px 10px", fontFamily: "inherit", fontSize: 13, borderRadius: 3 }} />
        </div>

        {/* requirement breakdown */}
        <SectionLabel>What it needs · what you've got</SectionLabel>
        <div style={{ marginBottom: 18 }}>
          {plan.map((p) => (
            <div key={p.m} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: C.panel, border: `1px solid ${C.line}`, borderLeft: `3px solid ${p.short === 0 ? C.green : C.rust}`, borderRadius: 3, marginBottom: 6 }}>
              <div style={{ flex: 1, fontSize: 13 }}>{p.m}</div>
              <div style={{ fontSize: 12, color: C.textDim }}>
                have <span style={{ color: C.text }}>{p.have}</span> / need <span style={{ color: C.text }}>{p.need}</span>
              </div>
              <div style={{ width: 70, textAlign: "right", fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 14, color: p.short === 0 ? C.green : C.rust }}>
                {p.short === 0 ? "SET" : `−${p.short}`}
              </div>
            </div>
          ))}
        </div>

        {/* the plan */}
        <SectionLabel>The plan</SectionLabel>
        <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 4, padding: "14px 16px" }}>
          {recycleSuggestions.length > 0 && (
            <>
              <div style={{ fontFamily: "Oswald, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 11, color: C.green, marginBottom: 8 }}>
                ① Recycle from your stash
              </div>
              {recycleSuggestions.map((r, i) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 6, lineHeight: 1.4 }}>
                  <span style={{ color: C.text }}>{r.name} ×{r.qty}</span>
                  <span style={{ color: C.textDim }}> → {r.gives}</span>
                </div>
              ))}
            </>
          )}

          {farmList.length > 0 ? (
            <>
              <div style={{ fontFamily: "Oswald, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 11, color: C.amber, marginTop: recycleSuggestions.length ? 14 : 0, marginBottom: 8 }}>
                {recycleSuggestions.length ? "②" : "①"} Farm these zones
              </div>
              {farmList.map((p) => (
                <div key={p.m} style={{ padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: C.text }}>{p.zone ? p.zone.zone : "Unknown zone"}</span>
                    <span style={{ color: C.rust }}>need {p.short} {p.m}</span>
                  </div>
                  {p.zone && <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{p.zone.tip}</div>}
                </div>
              ))}
            </>
          ) : (
            <div style={{ fontSize: 13, color: C.green, marginTop: recycleSuggestions.length ? 12 : 0 }}>
              ✓ Your stash already covers this. Recycle the items above and craft — no raid needed.
            </div>
          )}
        </div>

        {fullyCovered && recycleSuggestions.length === 0 && (
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 12, lineHeight: 1.5 }}>
            Nothing in your stash applies and nothing's short — looks like you're already stocked on raw materials.
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily: "Oswald, sans-serif", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 12, color: "#a87528", marginBottom: 10, fontWeight: 600 }}>{children}</div>;
}
