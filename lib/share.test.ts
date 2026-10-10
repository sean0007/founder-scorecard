import assert from "node:assert/strict";
import { test } from "node:test";
import { moat } from "./calc";
import { ENDPOINTS } from "./api";
import { EXAMPLE_INPUTS, isExample, ogPath, parseResultParams, resultHeadline, resultPath, resultQuery } from "./share";

const EXAMPLE_QUERY = "margin=7&operations=4&advantage=6&tam=8&pain=true&money=true&suffer=true";

test("example query is stable and round-trips", () => {
  assert.equal(resultQuery(EXAMPLE_INPUTS), EXAMPLE_QUERY);
  assert.deepEqual(parseResultParams(new URLSearchParams(EXAMPLE_QUERY)), EXAMPLE_INPUTS);
  assert.equal(resultPath(EXAMPLE_INPUTS), `/r?${EXAMPLE_QUERY}`);
  assert.equal(ogPath(EXAMPLE_INPUTS), `/og?${EXAMPLE_QUERY}`);
  assert.ok(isExample(EXAMPLE_INPUTS));
});

test("example matches the /api/moat example", () => {
  assert.equal(ENDPOINTS.moat.example, `/api/moat?${EXAMPLE_QUERY}`);
});

test("result page shows the same math as the calculator", () => {
  const r = moat(parseResultParams(new URLSearchParams(EXAMPLE_QUERY))!);
  assert.equal(r.total, 25);
  assert.equal(r.verdict, "FIX IT");
  assert.equal(resultHeadline(r), "FIX IT: MOAT score 25/40, weakest Operations");
});

test("empty or partial links have no result", () => {
  assert.equal(parseResultParams(new URLSearchParams("")), null);
  assert.equal(parseResultParams(new URLSearchParams("margin=5&operations=5&advantage=5")), null);
  assert.equal(parseResultParams({ margin: "x", operations: "5", advantage: "5", tam: "5" }), null);
});

test("hand-edited values are clamped and rounded like the sliders", () => {
  const p = parseResultParams(new URLSearchParams("margin=99&operations=-3&advantage=6.6&tam=10&pain=no&money=0&suffer=yes"))!;
  assert.deepEqual(p, { margin: 10, operations: 1, advantage: 7, tam: 10, pain: false, money: false, suffer: true });
  assert.equal(resultQuery(p), "margin=10&operations=1&advantage=7&tam=10&pain=false&money=false&suffer=true");
  assert.ok(!isExample(p));
});

test("checks default to true when missing, like the API", () => {
  const p = parseResultParams({ margin: ["9"], operations: "9", advantage: "9", tam: "9" })!;
  assert.equal(p.pain && p.money && p.suffer, true);
  assert.equal(moat(p).verdict, "FUND IT");
});
