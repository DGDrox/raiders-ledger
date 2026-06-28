// Arc Raiders — Recipe Database
// Source: arcraiders.wiki (scraped June 2026 via Cowork)
//
// Coverage stats:
//   Hideout       : 18  (6 Workshop stations × 3 levels each; Workbench has no material cost)
//   Combat        : 96  (20 weapon Tier-I crafts + 60 weapon upgrades I→II/II→III/III→IV + 16 explosives)
//   Crafted Item  : 100 (17 refined materials + 5 ammo + 8 medical + 3 shields + 15 augments
//                         + 9 mods Tier I + 11 mods Tier II + 14 mods Tier III
//                         + 14 utility items + 4 light sticks)
//   TOTAL         : 214
//
// Wiki-incomplete / excluded notes:
//   - Workbench has no material upgrade cost ("1 Round Played" — progression unlock, not crafted)
//   - Stash upgrades cost Cred (currency), not materials — excluded
//   - Red / Blue / Yellow Light Stick: recipe assumed same as Green Light Stick (3× Chemicals)
//   - Tactical Mk. 3 (Revival) and (Smoke): recipe assumed same as other Mk. 3 variants
//   - Gas Mine: no crafting recipe found on wiki — excluded
//   - Extended Barrel I: not listed as a Gunsmith 1 unlock; recipe unknown — excluded
//   - Silencer III: recipe not documented on wiki — excluded
//   - Blaze Grenade item page says Explosives Station 3; Workshop tab shows Lv.2 unlock —
//     item-page data used here
//
// PROPOSAL: A 4th "Weapon Upgrade" category would better separate tier-transition recipes
//   from initial weapon crafts, but all weapon recipes are kept under "Combat" to stay
//   within the existing 3-category schema.
//
// Known integration gap: weapon-tier ingredient names like "Ferro I", "Kettle II" don't
//   resolve through ITEM_BY_NAME because WEAPON_ITEMS was collapsed in commit d711018 to
//   one entry per weapon (no tier suffix). The UI handles this gracefully — no rarity
//   dot, "No map currently lists this in its top drops." Recipe meaning is still clear
//   ("upgrade your Ferro I, plus 7 Metal Parts"). Revisit if upgrade flow needs tier-
//   specific recommendations.

import type { Recipe } from "../engine/types";

export const RECIPES: Recipe[] = [

  // ── HIDEOUT ──────────────────────────────────────────────────────────────────
  { name: "Gunsmith Lv.1", category: "Hideout", needs: { "Metal Parts": 20, "Rubber Parts": 30 } },
  { name: "Gunsmith Lv.2", category: "Hideout", needs: { "Rusted Tools": 3, "Mechanical Components": 5, "Wasp Driver": 8 } },
  { name: "Gunsmith Lv.3", category: "Hideout", needs: { "Rusted Gear": 3, "Advanced Mechanical Components": 5, "Sentinel Firing Core": 4 } },
  { name: "Gear Bench Lv.1", category: "Hideout", needs: { "Plastic Parts": 25, "Fabric": 30 } },
  { name: "Gear Bench Lv.2", category: "Hideout", needs: { "Power Cable": 3, "Electrical Components": 5, "Hornet Driver": 5 } },
  { name: "Gear Bench Lv.3", category: "Hideout", needs: { "Industrial Battery": 3, "Advanced Electrical Components": 5, "Bastion Cell": 6 } },
  { name: "Medical Lab Lv.1", category: "Hideout", needs: { "Fabric": 50, "ARC Alloy": 6 } },
  { name: "Medical Lab Lv.2", category: "Hideout", needs: { "Cracked Bioscanner": 2, "Durable Cloth": 5, "Tick Pod": 8 } },
  { name: "Medical Lab Lv.3", category: "Hideout", needs: { "Rusted Shut Medical Kit": 3, "Antiseptic": 8, "Surveyor Vault": 5 } },
  { name: "Explosives Station Lv.1", category: "Hideout", needs: { "Chemicals": 50, "ARC Alloy": 6 } },
  { name: "Explosives Station Lv.2", category: "Hideout", needs: { "Synthesized Fuel": 3, "Crude Explosives": 5, "Pop Trigger": 5 } },
  { name: "Explosives Station Lv.3", category: "Hideout", needs: { "Laboratory Reagents": 3, "Explosive Compound": 5, "Rocketeer Driver": 3 } },
  { name: "Utility Station Lv.1", category: "Hideout", needs: { "Plastic Parts": 50, "ARC Alloy": 6 } },
  { name: "Utility Station Lv.2", category: "Hideout", needs: { "Damaged Heat Sink": 2, "Electrical Components": 5, "Snitch Scanner": 6 } },
  { name: "Utility Station Lv.3", category: "Hideout", needs: { "Fried Motherboard": 3, "Advanced Electrical Components": 5, "Leaper Pulse Unit": 4 } },
  { name: "Refiner Lv.1", category: "Hideout", needs: { "Metal Parts": 60, "ARC Powercell": 5 } },
  { name: "Refiner Lv.2", category: "Hideout", needs: { "Toaster": 3, "ARC Motion Core": 5, "Fireball Burner": 8 } },
  { name: "Refiner Lv.3", category: "Hideout", needs: { "Motor": 3, "ARC Circuitry": 10, "Bombardier Cell": 6 } },

  // ── CRAFTED ITEM — Refined Materials ─────────────────────────────────────────
  { name: "Electrical Components",          category: "Crafted Item", needs: { "Plastic Parts": 8, "Rubber Parts": 4 } },
  { name: "Mechanical Components",          category: "Crafted Item", needs: { "Metal Parts": 7, "Rubber Parts": 3 } },
  { name: "Crude Explosives",               category: "Crafted Item", needs: { "Chemicals": 6 } },
  { name: "Durable Cloth",                  category: "Crafted Item", needs: { "Fabric": 14 } },
  { name: "Advanced Electrical Components", category: "Crafted Item", needs: { "Wires": 3, "Electrical Components": 2 } },
  { name: "Advanced Mechanical Components", category: "Crafted Item", needs: { "Steel Spring": 2, "Mechanical Components": 2 } },
  { name: "ARC Circuitry",                  category: "Crafted Item", needs: { "ARC Alloy": 8 } },
  { name: "ARC Motion Core",                category: "Crafted Item", needs: { "ARC Alloy": 8 } },
  { name: "Explosive Compound",             category: "Crafted Item", needs: { "Crude Explosives": 2, "Oil": 2 } },
  { name: "Mod Components",                 category: "Crafted Item", needs: { "Steel Spring": 2, "Mechanical Components": 2 } },
  { name: "Antiseptic",                     category: "Crafted Item", needs: { "Chemicals": 10, "Great Mullein": 2 } },
  { name: "Light Gun Parts",                category: "Crafted Item", needs: { "Simple Gun Parts": 4 } },
  { name: "Medium Gun Parts",               category: "Crafted Item", needs: { "Simple Gun Parts": 4 } },
  { name: "Heavy Gun Parts",                category: "Crafted Item", needs: { "Simple Gun Parts": 4 } },
  { name: "Magnetic Accelerator",           category: "Crafted Item", needs: { "Advanced Mechanical Components": 2, "ARC Motion Core": 2 } },
  { name: "Power Rod",                      category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "ARC Circuitry": 2 } },
  { name: "Complex Gun Parts",              category: "Crafted Item", needs: { "Light Gun Parts": 2, "Medium Gun Parts": 2, "Heavy Gun Parts": 2 } },

  // ── CRAFTED ITEM — Ammunition ────────────────────────────────────────────────
  // Yields per craft: Light 25×, Medium 20×, Heavy 10×, Shotgun 5×, Launcher 6×
  { name: "Light Ammo",    category: "Crafted Item", needs: { "Metal Parts": 3, "Chemicals": 2 } },
  { name: "Medium Ammo",   category: "Crafted Item", needs: { "Metal Parts": 3, "Chemicals": 2 } },
  { name: "Heavy Ammo",    category: "Crafted Item", needs: { "Metal Parts": 3, "Chemicals": 2 } },
  { name: "Shotgun Ammo",  category: "Crafted Item", needs: { "Metal Parts": 3, "Chemicals": 2 } },
  { name: "Launcher Ammo", category: "Crafted Item", needs: { "ARC Motion Core": 1, "Crude Explosives": 2 } },

  // ── CRAFTED ITEM — Medical ───────────────────────────────────────────────────
  { name: "Bandage",                category: "Crafted Item", needs: { "Fabric": 5 } },
  { name: "Shield Recharger",       category: "Crafted Item", needs: { "Rubber Parts": 5, "ARC Powercell": 1 } },
  { name: "Adrenaline Shot",        category: "Crafted Item", needs: { "Chemicals": 3, "Plastic Parts": 3 } },
  { name: "Herbal Bandage",         category: "Crafted Item", needs: { "Durable Cloth": 1, "Great Mullein": 1 } },
  { name: "Sterilized Bandage",     category: "Crafted Item", needs: { "Durable Cloth": 2, "Antiseptic": 1 } },
  { name: "Surge Shield Recharger", category: "Crafted Item", needs: { "Electrical Components": 1, "Advanced ARC Powercell": 1 } },
  { name: "Vita Shot",              category: "Crafted Item", needs: { "Antiseptic": 2, "Syringe": 1 } },
  { name: "Vita Spray",             category: "Crafted Item", needs: { "Antiseptic": 3, "Canister": 1, "Tick Pod": 1 } },

  // ── CRAFTED ITEM — Shields ───────────────────────────────────────────────────
  { name: "Light Shield",  category: "Crafted Item", needs: { "ARC Alloy": 2, "Plastic Parts": 4 } },
  { name: "Medium Shield", category: "Crafted Item", needs: { "Battery": 4, "ARC Circuitry": 1 } },
  { name: "Heavy Shield",  category: "Crafted Item", needs: { "Power Rod": 1, "Voltage Converter": 2 } },

  // ── CRAFTED ITEM — Augments ──────────────────────────────────────────────────
  { name: "Combat Mk. 1",               category: "Crafted Item", needs: { "Rubber Parts": 6, "Plastic Parts": 6 } },
  { name: "Looting Mk. 1",              category: "Crafted Item", needs: { "Rubber Parts": 6, "Plastic Parts": 6 } },
  { name: "Tactical Mk. 1",             category: "Crafted Item", needs: { "Rubber Parts": 6, "Plastic Parts": 6 } },
  { name: "Combat Mk. 2",               category: "Crafted Item", needs: { "Electrical Components": 2, "Magnet": 3 } },
  { name: "Looting Mk. 2",              category: "Crafted Item", needs: { "Electrical Components": 2, "Magnet": 3 } },
  { name: "Tactical Mk. 2",             category: "Crafted Item", needs: { "Electrical Components": 2, "Magnet": 3 } },
  { name: "Combat Mk. 3 (Aggressive)",  category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "Processor": 3 } },
  { name: "Combat Mk. 3 (Flanking)",    category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "Processor": 3 } },
  { name: "Looting Mk. 3 (Cautious)",   category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "Processor": 3 } },
  { name: "Looting Mk. 3 (Safekeeper)", category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "Processor": 3 } },
  { name: "Looting Mk. 3 (Survivor)",   category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "Processor": 3 } },
  { name: "Tactical Mk. 3 (Defensive)", category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "Processor": 3 } },
  { name: "Tactical Mk. 3 (Healing)",   category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "Processor": 3 } },
  { name: "Tactical Mk. 3 (Revival)",   category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "Processor": 3 } }, // assumed
  { name: "Tactical Mk. 3 (Smoke)",     category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "Processor": 3 } }, // assumed

  // ── CRAFTED ITEM — Mods Tier I ───────────────────────────────────────────────
  { name: "Angled Grip I",          category: "Crafted Item", needs: { "Plastic Parts": 6, "Duct Tape": 1 } },
  { name: "Compensator I",          category: "Crafted Item", needs: { "Metal Parts": 6, "Wires": 1 } },
  { name: "Extended Light Mag I",   category: "Crafted Item", needs: { "Plastic Parts": 6, "Steel Spring": 1 } },
  { name: "Extended Medium Mag I",  category: "Crafted Item", needs: { "Plastic Parts": 6, "Steel Spring": 1 } },
  { name: "Extended Shotgun Mag I", category: "Crafted Item", needs: { "Plastic Parts": 6, "Steel Spring": 1 } },
  { name: "Muzzle Brake I",         category: "Crafted Item", needs: { "Metal Parts": 6, "Wires": 1 } },
  { name: "Shotgun Choke I",        category: "Crafted Item", needs: { "Metal Parts": 6, "Wires": 1 } },
  { name: "Stable Stock I",         category: "Crafted Item", needs: { "Rubber Parts": 6, "Duct Tape": 1 } },
  { name: "Vertical Grip I",        category: "Crafted Item", needs: { "Plastic Parts": 6, "Duct Tape": 1 } },

  // ── CRAFTED ITEM — Mods Tier II ──────────────────────────────────────────────
  { name: "Angled Grip II",          category: "Crafted Item", needs: { "Mechanical Components": 2, "Duct Tape": 3 } },
  { name: "Compensator II",          category: "Crafted Item", needs: { "Mechanical Components": 2, "Wires": 4 } },
  { name: "Extended Barrel II",      category: "Crafted Item", needs: { "Mechanical Components": 3, "Wires": 6 } },
  { name: "Extended Light Mag II",   category: "Crafted Item", needs: { "Mechanical Components": 2, "Steel Spring": 3 } },
  { name: "Extended Medium Mag II",  category: "Crafted Item", needs: { "Mechanical Components": 2, "Steel Spring": 3 } },
  { name: "Extended Shotgun Mag II", category: "Crafted Item", needs: { "Mechanical Components": 2, "Steel Spring": 3 } },
  { name: "Muzzle Brake II",         category: "Crafted Item", needs: { "Mechanical Components": 2, "Wires": 4 } },
  { name: "Shotgun Choke II",        category: "Crafted Item", needs: { "Mechanical Components": 2, "Wires": 4 } },
  { name: "Silencer I",              category: "Crafted Item", needs: { "Mechanical Components": 2, "Wires": 4 } },
  { name: "Stable Stock II",         category: "Crafted Item", needs: { "Mechanical Components": 2, "Duct Tape": 3 } },
  { name: "Vertical Grip II",        category: "Crafted Item", needs: { "Mechanical Components": 2, "Duct Tape": 3 } },

  // ── CRAFTED ITEM — Mods Tier III ─────────────────────────────────────────────
  { name: "Angled Grip III",          category: "Crafted Item", needs: { "Mod Components": 2, "Duct Tape": 5 } },
  { name: "Compensator III",          category: "Crafted Item", needs: { "Mod Components": 2, "Wires": 8 } },
  { name: "Extended Barrel III",      category: "Crafted Item", needs: { "Mod Components": 2, "Wires": 8 } },
  { name: "Extended Light Mag III",   category: "Crafted Item", needs: { "Mod Components": 2, "Steel Spring": 5 } },
  { name: "Extended Medium Mag III",  category: "Crafted Item", needs: { "Mod Components": 2, "Steel Spring": 5 } },
  { name: "Extended Shotgun Mag III", category: "Crafted Item", needs: { "Mod Components": 2, "Steel Spring": 5 } },
  { name: "Lightweight Stock",        category: "Crafted Item", needs: { "Mod Components": 2, "Duct Tape": 5 } },
  { name: "Muzzle Brake III",         category: "Crafted Item", needs: { "Mod Components": 2, "Wires": 8 } },
  { name: "Padded Stock",             category: "Crafted Item", needs: { "Mod Components": 2, "Duct Tape": 5 } },
  { name: "Shotgun Choke III",        category: "Crafted Item", needs: { "Mod Components": 2, "Wires": 8 } },
  { name: "Shotgun Silencer",         category: "Crafted Item", needs: { "Mod Components": 2, "Wires": 8 } },
  { name: "Silencer II",              category: "Crafted Item", needs: { "Mod Components": 2, "Wires": 8 } },
  { name: "Stable Stock III",         category: "Crafted Item", needs: { "Mod Components": 2, "Duct Tape": 5 } },
  { name: "Vertical Grip III",        category: "Crafted Item", needs: { "Mod Components": 2, "Duct Tape": 5 } },

  // ── CRAFTED ITEM — Utility ───────────────────────────────────────────────────
  { name: "Binoculars",          category: "Crafted Item", needs: { "Plastic Parts": 8, "Rubber Parts": 4 } },
  { name: "Door Blocker",        category: "Crafted Item", needs: { "Metal Parts": 3, "Rubber Parts": 3 } },
  { name: "Firecracker",         category: "Crafted Item", needs: { "Plastic Parts": 4, "Chemicals": 2 } },
  { name: "Li'l Smoke Grenade",  category: "Crafted Item", needs: { "Chemicals": 5, "Plastic Parts": 1 } },
  { name: "Barricade Kit",       category: "Crafted Item", needs: { "Mechanical Components": 1 } },
  { name: "Remote Raider Flare", category: "Crafted Item", needs: { "Chemicals": 2, "Rubber Parts": 4 } },
  { name: "Smoke Grenade",       category: "Crafted Item", needs: { "Chemicals": 14, "Canister": 1 } },
  { name: "Crash Mat",           category: "Crafted Item", needs: { "Electrical Components": 1, "Durable Cloth": 1 } },
  { name: "Lure Grenade",        category: "Crafted Item", needs: { "Speaker Component": 1, "Electrical Components": 1 } },
  { name: "Raider Hatch Key",    category: "Crafted Item", needs: { "Advanced Electrical Components": 1, "Sensors": 3 } },
  { name: "Zipline",             category: "Crafted Item", needs: { "Rope": 1, "Mechanical Components": 1 } },
  { name: "Photoelectric Cloak", category: "Crafted Item", needs: { "Advanced Electrical Components": 2, "Speaker Component": 4 } },
  { name: "Snap Hook",           category: "Crafted Item", needs: { "Power Rod": 2, "Rope": 3, "Exodus Modules": 1 } },
  { name: "Tagging Grenade",     category: "Crafted Item", needs: { "Electrical Components": 1, "Sensors": 1 } },

  // ── CRAFTED ITEM — Light Sticks ──────────────────────────────────────────────
  { name: "Green Light Stick",  category: "Crafted Item", needs: { "Chemicals": 3 } },
  { name: "Red Light Stick",    category: "Crafted Item", needs: { "Chemicals": 3 } }, // assumed
  { name: "Blue Light Stick",   category: "Crafted Item", needs: { "Chemicals": 3 } }, // assumed
  { name: "Yellow Light Stick", category: "Crafted Item", needs: { "Chemicals": 3 } }, // assumed

  // ── COMBAT — Explosives & Grenades ───────────────────────────────────────────
  { name: "Gas Grenade",          category: "Combat", needs: { "Chemicals": 4, "Rubber Parts": 2 } },
  { name: "Light Impact Grenade", category: "Combat", needs: { "Plastic Parts": 2, "Chemicals": 3 } },
  { name: "Seeker Grenade",       category: "Combat", needs: { "Crude Explosives": 1, "ARC Alloy": 2 } },
  { name: "Pulse Mine",           category: "Combat", needs: { "Crude Explosives": 1, "Wires": 1 } },
  { name: "Shrapnel Grenade",     category: "Combat", needs: { "Crude Explosives": 1, "Steel Spring": 2 } },
  { name: "Snap Blast Grenade",   category: "Combat", needs: { "Crude Explosives": 2, "Magnet": 1 } },
  { name: "Trigger 'Nade",        category: "Combat", needs: { "Crude Explosives": 2, "Processor": 1 } },
  { name: "Jolt Mine",            category: "Combat", needs: { "Electrical Components": 1, "Battery": 1 } },
  { name: "Heavy Fuze Grenade",   category: "Combat", needs: { "Explosive Compound": 1, "Canister": 2 } },
  { name: "Blaze Grenade",        category: "Combat", needs: { "Explosive Compound": 1, "Oil": 2 } },
  { name: "Explosive Mine",       category: "Combat", needs: { "Explosive Compound": 1, "Sensors": 1 } },
  { name: "Wolfpack",             category: "Combat", needs: { "Explosive Compound": 1, "ARC Motion Core": 2, "Rocketeer Driver": 1 } },
  { name: "Deadline",             category: "Combat", needs: { "Comet Igniter": 1, "Explosive Compound": 3, "ARC Circuitry": 2 } },
  { name: "Showstopper",          category: "Combat", needs: { "Electrical Components": 1, "Hornet Driver": 1, "Voltage Converter": 1 } },
  { name: "Surge Coil",           category: "Combat", needs: { "Electrical Components": 1, "Sensors": 1, "Hornet Driver": 1 } },
  { name: "Trailblazer",          category: "Combat", needs: { "Synthesized Fuel": 1, "Crude Explosives": 2, "Firefly Burner": 1 } },

  // ── COMBAT — Weapon Tier I Crafts ────────────────────────────────────────────
  { name: "Ferro I",       category: "Combat", needs: { "Metal Parts": 5, "Rubber Parts": 2 } },
  { name: "Kettle I",      category: "Combat", needs: { "Metal Parts": 6, "Rubber Parts": 8 } },
  { name: "Hairpin I",     category: "Combat", needs: { "Metal Parts": 2, "Plastic Parts": 5 } },
  { name: "Rattler I",     category: "Combat", needs: { "Metal Parts": 16, "Rubber Parts": 12 } },
  { name: "Stitcher I",    category: "Combat", needs: { "Metal Parts": 8, "Rubber Parts": 4 } },
  { name: "Anvil I",       category: "Combat", needs: { "Mechanical Components": 5, "Simple Gun Parts": 6 } },
  { name: "Burletta I",    category: "Combat", needs: { "Mechanical Components": 3, "Simple Gun Parts": 3 } },
  { name: "Il Toro I",     category: "Combat", needs: { "Mechanical Components": 5, "Simple Gun Parts": 6 } },
  { name: "Arpeggio I",    category: "Combat", needs: { "Mechanical Components": 6, "Simple Gun Parts": 6 } },
  { name: "Osprey I",      category: "Combat", needs: { "Advanced Mechanical Components": 2, "Medium Gun Parts": 3, "Wires": 7 } },
  { name: "Rascal I",      category: "Combat", needs: { "Advanced Mechanical Components": 2, "Heavy Gun Parts": 3, "Canister": 5 } },
  { name: "Torrente I",    category: "Combat", needs: { "Advanced Mechanical Components": 2, "Medium Gun Parts": 3, "Steel Spring": 6 } },
  { name: "Venator I",     category: "Combat", needs: { "Advanced Mechanical Components": 2, "Medium Gun Parts": 3, "Magnet": 5 } },
  { name: "Bettina I",     category: "Combat", needs: { "Advanced Mechanical Components": 3, "Heavy Gun Parts": 3, "Canister": 3 } },
  { name: "Bobcat I",      category: "Combat", needs: { "Magnetic Accelerator": 1, "Light Gun Parts": 3, "Exodus Modules": 2 } },
  { name: "Canto I",       category: "Combat", needs: { "Advanced Mechanical Components": 2, "Magnet": 5, "Medium Gun Parts": 3 } },
  { name: "Hullcracker I", category: "Combat", needs: { "Magnetic Accelerator": 1, "Heavy Gun Parts": 3, "Exodus Modules": 1 } },
  { name: "Renegade I",    category: "Combat", needs: { "Advanced Mechanical Components": 2, "Medium Gun Parts": 3, "Oil": 5 } },
  { name: "Tempest I",     category: "Combat", needs: { "Magnetic Accelerator": 1, "Medium Gun Parts": 3, "Exodus Modules": 2 } },
  { name: "Vulcano I",     category: "Combat", needs: { "Magnetic Accelerator": 1, "Heavy Gun Parts": 3, "Exodus Modules": 1 } },

  // ── COMBAT — Weapon Upgrades ─────────────────────────────────────────────────
  // Tier ingredients (Ferro I/II/III, Kettle II, …) don't resolve through ITEM_BY_NAME —
  // WEAPON_ITEMS uses base names only. UI degrades gracefully.
  { name: "Ferro I → II",        category: "Combat", needs: { "Ferro I": 1, "Metal Parts": 7 } },
  { name: "Ferro II → III",      category: "Combat", needs: { "Ferro II": 1, "Metal Parts": 9, "Simple Gun Parts": 1 } },
  { name: "Ferro III → IV",      category: "Combat", needs: { "Ferro III": 1, "Mechanical Components": 1, "Simple Gun Parts": 1 } },
  { name: "Kettle I → II",       category: "Combat", needs: { "Kettle I": 1, "Metal Parts": 8, "Plastic Parts": 10 } },
  { name: "Kettle II → III",     category: "Combat", needs: { "Kettle II": 1, "Metal Parts": 10, "Simple Gun Parts": 1 } },
  { name: "Kettle III → IV",     category: "Combat", needs: { "Kettle III": 1, "Mechanical Components": 3, "Simple Gun Parts": 1 } },
  { name: "Hairpin I → II",      category: "Combat", needs: { "Hairpin I": 1, "Metal Parts": 8 } },
  { name: "Hairpin II → III",    category: "Combat", needs: { "Hairpin II": 1, "Metal Parts": 9, "Simple Gun Parts": 1 } },
  { name: "Hairpin III → IV",    category: "Combat", needs: { "Hairpin III": 1, "Mechanical Components": 1, "Simple Gun Parts": 1 } },
  { name: "Rattler I → II",      category: "Combat", needs: { "Rattler I": 1, "Metal Parts": 10, "Rubber Parts": 10 } },
  { name: "Rattler II → III",    category: "Combat", needs: { "Rattler II": 1, "Mechanical Components": 3, "Simple Gun Parts": 1 } },
  { name: "Rattler III → IV",    category: "Combat", needs: { "Rattler III": 1, "Mechanical Components": 3, "Simple Gun Parts": 1 } },
  { name: "Stitcher I → II",     category: "Combat", needs: { "Stitcher I": 1, "Metal Parts": 8, "Rubber Parts": 12 } },
  { name: "Stitcher II → III",   category: "Combat", needs: { "Stitcher II": 1, "Metal Parts": 10, "Simple Gun Parts": 1 } },
  { name: "Stitcher III → IV",   category: "Combat", needs: { "Stitcher III": 1, "Mechanical Components": 3, "Simple Gun Parts": 1 } },
  { name: "Anvil I → II",        category: "Combat", needs: { "Anvil I": 1, "Mechanical Components": 3, "Simple Gun Parts": 1 } },
  { name: "Anvil II → III",      category: "Combat", needs: { "Anvil II": 1, "Mechanical Components": 4, "Heavy Gun Parts": 1 } },
  { name: "Anvil III → IV",      category: "Combat", needs: { "Anvil III": 1, "Mechanical Components": 4, "Heavy Gun Parts": 1 } },
  { name: "Burletta I → II",     category: "Combat", needs: { "Burletta I": 1, "Mechanical Components": 3, "Simple Gun Parts": 1 } },
  { name: "Burletta II → III",   category: "Combat", needs: { "Burletta II": 1, "Mechanical Components": 3, "Simple Gun Parts": 1 } },
  { name: "Burletta III → IV",   category: "Combat", needs: { "Burletta III": 1, "Mechanical Components": 4, "Light Gun Parts": 1 } },
  { name: "Il Toro I → II",      category: "Combat", needs: { "Il Toro I": 1, "Mechanical Components": 3, "Simple Gun Parts": 1 } },
  { name: "Il Toro II → III",    category: "Combat", needs: { "Il Toro II": 1, "Mechanical Components": 4, "Heavy Gun Parts": 1 } },
  { name: "Il Toro III → IV",    category: "Combat", needs: { "Il Toro III": 1, "Mechanical Components": 4, "Heavy Gun Parts": 1 } },
  { name: "Arpeggio I → II",     category: "Combat", needs: { "Arpeggio I": 1, "Mechanical Components": 4, "Simple Gun Parts": 1 } },
  { name: "Arpeggio II → III",   category: "Combat", needs: { "Arpeggio II": 1, "Mechanical Components": 5, "Medium Gun Parts": 1 } },
  { name: "Arpeggio III → IV",   category: "Combat", needs: { "Arpeggio III": 1, "Mechanical Components": 5, "Medium Gun Parts": 1 } },
  { name: "Osprey I → II",       category: "Combat", needs: { "Osprey I": 1, "Advanced Mechanical Components": 1, "Medium Gun Parts": 2 } },
  { name: "Osprey II → III",     category: "Combat", needs: { "Osprey II": 1, "Advanced Mechanical Components": 1, "Medium Gun Parts": 2 } },
  { name: "Osprey III → IV",     category: "Combat", needs: { "Osprey III": 1, "Advanced Mechanical Components": 2, "Medium Gun Parts": 2 } },
  { name: "Rascal I → II",       category: "Combat", needs: { "Rascal I": 1, "Advanced Mechanical Components": 1, "Heavy Gun Parts": 2 } },
  { name: "Rascal II → III",     category: "Combat", needs: { "Rascal II": 1, "Advanced Mechanical Components": 1, "Heavy Gun Parts": 2 } },
  { name: "Rascal III → IV",     category: "Combat", needs: { "Rascal III": 1, "Advanced Mechanical Components": 2, "Heavy Gun Parts": 2 } },
  { name: "Torrente I → II",     category: "Combat", needs: { "Torrente I": 1, "Advanced Mechanical Components": 1, "Medium Gun Parts": 2 } },
  { name: "Torrente II → III",   category: "Combat", needs: { "Torrente II": 1, "Advanced Mechanical Components": 1, "Medium Gun Parts": 2 } },
  { name: "Torrente III → IV",   category: "Combat", needs: { "Torrente III": 1, "Advanced Mechanical Components": 2, "Medium Gun Parts": 2 } },
  { name: "Venator I → II",      category: "Combat", needs: { "Venator I": 1, "Advanced Mechanical Components": 1, "Medium Gun Parts": 2 } },
  { name: "Venator II → III",    category: "Combat", needs: { "Venator II": 1, "Advanced Mechanical Components": 1, "Medium Gun Parts": 2 } },
  { name: "Venator III → IV",    category: "Combat", needs: { "Venator III": 1, "Advanced Mechanical Components": 2, "Medium Gun Parts": 2 } },
  { name: "Bettina I → II",      category: "Combat", needs: { "Bettina I": 1, "Advanced Mechanical Components": 1, "Heavy Gun Parts": 2 } },
  { name: "Bettina II → III",    category: "Combat", needs: { "Bettina II": 1, "Advanced Mechanical Components": 1, "Heavy Gun Parts": 2 } },
  { name: "Bettina III → IV",    category: "Combat", needs: { "Bettina III": 1, "Advanced Mechanical Components": 2, "Heavy Gun Parts": 2 } },
  { name: "Bobcat I → II",       category: "Combat", needs: { "Bobcat I": 1, "Advanced Mechanical Components": 2, "Light Gun Parts": 1 } },
  { name: "Bobcat II → III",     category: "Combat", needs: { "Bobcat II": 1, "Advanced Mechanical Components": 2, "Light Gun Parts": 3 } },
  { name: "Bobcat III → IV",     category: "Combat", needs: { "Bobcat III": 1, "Advanced Mechanical Components": 2, "Light Gun Parts": 3 } },
  { name: "Canto I → II",        category: "Combat", needs: { "Canto I": 1, "Mechanical Components": 1, "Medium Gun Parts": 2 } },
  { name: "Canto II → III",      category: "Combat", needs: { "Canto II": 1, "Mechanical Components": 1, "Medium Gun Parts": 2 } },
  { name: "Canto III → IV",      category: "Combat", needs: { "Canto III": 1, "Mechanical Components": 2, "Medium Gun Parts": 2 } },
  { name: "Hullcracker I → II",  category: "Combat", needs: { "Hullcracker I": 1, "Advanced Mechanical Components": 1, "Heavy Gun Parts": 2 } },
  { name: "Hullcracker II → III",category: "Combat", needs: { "Hullcracker II": 1, "Advanced Mechanical Components": 2, "Heavy Gun Parts": 1 } },
  { name: "Hullcracker III → IV",category: "Combat", needs: { "Hullcracker III": 1, "Advanced Mechanical Components": 2, "Heavy Gun Parts": 3 } },
  { name: "Renegade I → II",     category: "Combat", needs: { "Renegade I": 1, "Advanced Mechanical Components": 1, "Medium Gun Parts": 2 } },
  { name: "Renegade II → III",   category: "Combat", needs: { "Renegade II": 1, "Advanced Mechanical Components": 1, "Medium Gun Parts": 2 } },
  { name: "Renegade III → IV",   category: "Combat", needs: { "Renegade III": 1, "Advanced Mechanical Components": 2, "Medium Gun Parts": 2 } },
  { name: "Tempest I → II",      category: "Combat", needs: { "Tempest I": 1, "Advanced Mechanical Components": 2, "Medium Gun Parts": 1 } },
  { name: "Tempest II → III",    category: "Combat", needs: { "Tempest II": 1, "Advanced Mechanical Components": 2, "Medium Gun Parts": 3 } },
  { name: "Tempest III → IV",    category: "Combat", needs: { "Tempest III": 1, "Advanced Mechanical Components": 2, "Medium Gun Parts": 3 } },
  { name: "Vulcano I → II",      category: "Combat", needs: { "Vulcano I": 1, "Advanced Mechanical Components": 1, "Heavy Gun Parts": 2 } },
  { name: "Vulcano II → III",    category: "Combat", needs: { "Vulcano II": 1, "Advanced Mechanical Components": 2, "Heavy Gun Parts": 1 } },
  { name: "Vulcano III → IV",    category: "Combat", needs: { "Vulcano III": 1, "Advanced Mechanical Components": 2, "Heavy Gun Parts": 3 } },
];
