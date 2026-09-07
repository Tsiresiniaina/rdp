import { isCrossable } from "./engine.js";
import { fire } from "./engine.js";
export function buildSequence(core, marking, transitionIds) {
  var sequence = [];
  sequence.push({ marking: marking, fireId: null });
  var currentMarking = marking;
  for (var transition of transitionIds) {
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
