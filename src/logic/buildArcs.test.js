import { expect, it } from "vitest";
import { buildArcs } from "./buildArcs.js";
const core = {
  places: [{ id: "P1" }, { id: "P2" }],
  transitions: [{ id: "T1" }, { id: "T2" }],
  initialMarking: [1, 0],
  matricePre: [
    [1, 0],
    [0, 1],
  ],
  matricePost: [
    [0, 2],
    [1, 0],
  ],
};
it("should build arcs correctly", () => {
  const arcs = buildArcs(core);
  expect(arcs).toEqual([
    { id: "P1-T1-pre", from: "P1", to: "T1", weight: 1, kind: "pre" },
    { id: "P2-T2-pre", from: "P2", to: "T2", weight: 1, kind: "pre" },
    { id: "T2-P1-post", from: "T2", to: "P1", weight: 2, kind: "post" },
    { id: "T1-P2-post", from: "T1", to: "P2", weight: 1, kind: "post" },
  ]);
});
