import { buildSequence } from "./sequence";
import { expect, it, describe } from "vitest";
const core = {
  places: [{ id: "P1" }, { id: "P2" }],
    transitions: [{ id: "T1" }, { id: "T2" }],
    initialMarking: [1, 0],
    matricePre: [
        [1, 0],
        [0, 1]
    ],
    matricePost: [
        [0, 1],
        [1, 0]
    ]
};
describe("buildSequence", () => {
    it("should build a valid sequence of markings and fireIds", () => {
        const initialMarking = [1, 0];
        const transitionIds = ["T1", "T2"];
        const result = buildSequence(core, initialMarking, transitionIds);
        expect(result).toEqual([
            { marking: [1, 0], fireId: "T1" },
            { marking: [0, 1], fireId: "T2" }
        ]);
    });
    it("should throw an error for a non-crossable transition", () => {
        const initialMarking = [0, 1];
        const transitionIds = ["T1"];
        expect(() => buildSequence(core, initialMarking, transitionIds)).toThrow(
            "Transition with ID T1 is not crossable with the current marking."
        );
    });
    it("should throw an error for a non-existent transition", () => {
        const initialMarking = [1, 0];
        const transitionIds = ["T3"];
        expect(() => buildSequence(core, initialMarking, transitionIds)).toThrow(
            "Transition with ID T3 does not exist."
        );
    });
});