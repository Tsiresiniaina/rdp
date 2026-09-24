import { expect, it } from "vitest";
import { useSimulation } from "./useSimulation.js";

const core = {
  places: [{ id: "P1" }, { id: "P2" }],
  transitions: [{ id: "T1" }, { id: "T2" }],
  initialMarking: [1, 0],
  matricePre:  [[1, 0], [0, 1]],
  matricePost: [[0, 1], [1, 0]],
};

it("currentFireId suit la transition tirée", () => {
  const sim = useSimulation(core, ["T1", "T2"]);
  expect(sim.currentFireId.value).toBeNull();
  sim.nextStep();
  expect(sim.currentFireId.value).toBe("T1");
  sim.nextStep();
  expect(sim.currentFireId.value).toBe("T2");
  sim.previousStep();
  expect(sim.currentFireId.value).toBe("T1");
});