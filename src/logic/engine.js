import { core } from '../data/core.js'
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