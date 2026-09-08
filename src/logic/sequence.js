import { isCrossable } from "./engine.js";
import { fire } from "./engine.js";
//Determines the crossable transitions and builds a sequence of markings based on the given transition IDs. It starts with the initial marking and iteratively fires each transition, updating the marking accordingly. If a transition is not crossable with the current marking, it throws an error.
export function buildSequence(core, marking, transitionIds) {
  let sequence = [];
  sequence.push({ marking: marking, fireId: null });
  let currentMarking = marking;
  for (let transition of transitionIds) {
    if (!isCrossable(core, currentMarking, transition)) {
      throw new Error(
        `Transition with ID ${transition} is not crossable with the current marking.`,
      );
    }
    currentMarking = fire(core, currentMarking, transition);
    sequence.push({ marking: currentMarking, fireId: transition });
  }
  return sequence;
}
