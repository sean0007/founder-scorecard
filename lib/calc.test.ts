import { test } from "node:test";
import assert from "node:assert/strict";
import { moat, price, cash, list } from "./calc";

test("moat verdict bands", () => {
  const base = { pain: true, money: true, suffer: true };
  assert.equal(moat({ ...base, margin: 8, operations: 8, advantage: 7, tam: 7 }).verdict, "FUND IT");
  assert.equal(moat({ ...base, margin: 6, operations: 5, advantage: 5, tam: 6 }).verdict, "FIX IT");
  assert.equal(moat({ ...base, margin: 3, operations: 4, advantage: 5, tam: 5 }).verdict, "FLEE IT");
});

test("moat weakest and flags", () => {
  const r = moat({ margin: 9, operations: 2, advantage: 8, tam: 9, pain: false, money: true, suffer: true });
  assert.equal(r.weakest, "Operations");
  assert.equal(r.flags.length, 1);
});

test("price bands follow close rate", () => {
  const p = (c: number) => price({ closeRate: c, price: 100, netMargin: 15, newPriceMultiple: 2, customersLost: 0 }).band.label;
  assert.equal(p(85), "Way underpriced");
  assert.equal(p(65), "Underpriced");
  assert.equal(p(45), "Room to raise");
  assert.equal(p(30), "Priced about right");
  assert.equal(p(15), "Sales problem");
});

test("doubling price at 15% margin is about 7.7x profit", () => {
  const r = price({ closeRate: 80, price: 100, netMargin: 15, newPriceMultiple: 2, customersLost: 0 });
  assert.ok(Math.abs(r.profitMultiple - 7.667) < 0.01);
  // Tripling and losing a third (Hormozi's gym story) still grows profit.
  const g = price({ closeRate: 80, price: 100, netMargin: 15, newPriceMultiple: 3, customersLost: 33.3 });
  assert.ok(g.profitMultiple > 5);
});

test("cash ratio levels", () => {
  assert.equal(cash({ cash30: 1000, cac: 200, cogs30: 200 }).level, "SELF-FUNDING");
  assert.equal(cash({ cash30: 500, cac: 200, cogs30: 200 }).level, "BREAK-EVEN");
  const c = cash({ cash30: 300, cac: 200, cogs30: 200 });
  assert.equal(c.level, "CASH-HUNGRY");
  assert.equal(c.gapTo2x, 500);
});

test("list scenarios scale", () => {
  const r = list({ contacts: 10000, reachable: 70, buyRate: 1, orderValue: 100, partnerShare: 20 });
  assert.equal(r.reach, 7000);
  assert.equal(Math.round(r.mid.revenue), 7000);
  assert.equal(Math.round(r.low.revenue), 3500);
  assert.equal(Math.round(r.partnerFeeMid), 1400);
});
