import type { Item, MaterialPrices } from "../engine/types";

// Material reference prices (coin per unit). Placeholders — real values come
// from arcraiders.wiki and will be replaced here.
export const DEFAULT_MATERIALS: MaterialPrices = {
  "Metal Parts": 4,
  Gears: 12,
  "Electronic Components": 18,
  Battery: 22,
  Chemicals: 9,
  Fabric: 5,
  Toolset: 30,
};

// Starter item set — real Arc Raiders item names, placeholder economics.
export const DEFAULT_ITEMS: Item[] = [
  { id: "i1", name: "Old Battery", category: "Tech", sell: 35, recycle: [{ m: "Battery", q: 1 }, { m: "Metal Parts", q: 2 }] },
  { id: "i2", name: "Wristwatch", category: "Valuables", sell: 60, recycle: [{ m: "Gears", q: 1 }, { m: "Metal Parts", q: 1 }] },
  { id: "i3", name: "Circuit Board", category: "Tech", sell: 28, recycle: [{ m: "Electronic Components", q: 2 }] },
  { id: "i4", name: "Toolbox", category: "Tools", sell: 45, recycle: [{ m: "Toolset", q: 1 }, { m: "Metal Parts", q: 3 }] },
  { id: "i5", name: "Dog Collar", category: "Valuables", sell: 50, recycle: [{ m: "Fabric", q: 1 }] },
  { id: "i6", name: "Weapon Parts", category: "Combat", sell: 40, recycle: [{ m: "Metal Parts", q: 4 }, { m: "Gears", q: 1 }] },
  { id: "i7", name: "Cleaning Solution", category: "Chem", sell: 15, recycle: [{ m: "Chemicals", q: 2 }] },
  { id: "i8", name: "Sewing Kit", category: "Materials", sell: 20, recycle: [{ m: "Fabric", q: 3 }] },
];
