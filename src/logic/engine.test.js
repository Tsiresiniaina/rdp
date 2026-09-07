import { expect,it,describe } from "vitest";
import { isCrossable,fire,getCrossableTransitions } from "./engine.js";
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
describe("isCrossable", () => {
    it("should return true for a crossable transition", () => {
        const marking = [0, 1];
        const result = isCrossable(core, marking, "T2");
        expect(result).toBe(true);
    })
    it("should return false for a non-crossable transition", () => {
        const marking = [0, 1];
        const result = isCrossable(core, marking, "T1");
        expect(result).toBe(false);
    })
    it("should return false for a non-existent transition", () => {
        const marking = [0, 1];
        const result = isCrossable(core, marking, "T3");
        expect(result).toBe(false);
    })
});
describe("fire", () => {
    it("should return the new marking after firing a crossable transition", () => {
        const marking = [0, 1];
        const result = fire(core, marking, "T2");
        expect(result).toEqual([1, 0]);
    })
    it("should throw an error for a non-crossable transition", () => {
        const marking = [0, 1];
        expect(() => fire(core, marking, "T1")).toThrow("Transition with ID T1 is not crossable with the current marking.");
    })
    it("should throw an error for a non-existent transition", () => {
        const marking = [0, 1];
        expect(() => fire(core, marking, "T3")).toThrow("Transition with ID T3 not found in core.");
    })
}   
)
describe("getCrossableTransitions", () => {
    it("should return an array of crossable transition IDs", () => {
        const marking = [0, 1];
        const result = getCrossableTransitions(core, marking);
        expect(result).toEqual(["T2"]);
    });     
    it("should return an empty array if no transitions are crossable", () => {
        const marking = [0, 0];
        const result = getCrossableTransitions(core, marking);
        expect(result).toEqual([]);
    })
    it("should return all transition IDs if all are crossable", () => {
        const marking = [1, 1];
        const result = getCrossableTransitions(core, marking);
        expect(result).toEqual(["T1", "T2"]);
    })
});