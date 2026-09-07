
export function isCrossable(core, marking, transitionId) {
    const transitionIndex = core.transitions.findIndex(t => t.id === transitionId);
    if(transitionIndex === -1) {
        return false; // Transition not found
    }
    for(let placeIndex = 0; placeIndex < core.initialMarking.length; placeIndex++) {
        const requiredTokens = core.matricePre[placeIndex][transitionIndex];
        if(marking[placeIndex] < requiredTokens) {
            return false; // Not enough tokens in this place
        }
    }
    return true; // All places have enough tokens
}
export function fire(core, marking, transitionId) {
    const transitionIndex = core.transitions.findIndex(t => t.id === transitionId);
    if(transitionIndex === -1) {
        throw new Error(`Transition with ID ${transitionId} not found in core.`);
    }
    if(!isCrossable(core, marking, transitionId)) {
        throw new Error(`Transition with ID ${transitionId} is not crossable with the current marking.`);
    }
    const newMarking = [...marking];
    for(let placeIndex = 0; placeIndex < core.places.length; placeIndex++) {
        newMarking[placeIndex] = newMarking[placeIndex] - core.matricePre[placeIndex][transitionIndex] + core.matricePost[placeIndex][transitionIndex];
    }
    return newMarking; // Return the updated marking
}
export function getCrossableTransitions(core, marking) {
    const crossableTransitions = [];
    for(const transition of core.transitions) {
        if(isCrossable(core, marking, transition.id)) {
            crossableTransitions.push(transition.id);
        }
    }
    return crossableTransitions;
}