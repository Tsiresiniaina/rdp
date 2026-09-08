<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import PagePrincipale from "./components/PagePrincipale.vue";
import { core } from "./data/core.js";
import { validateCore } from "./data/validateCore.js";
import { isCrossable } from "./logic/engine.js";
import { fire } from "./logic/engine.js";
import { getCrossableTransitions } from "./logic/engine.js";
import { buildSequence } from "./logic/sequence.js";
import { useSimulation } from "./composables/useSimulation.js";

const errors = validateCore(core);
console.log(errors);
console.log(isCrossable(core, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], "T2"));
console.log(fire(core, [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], "T2"));
console.log(getCrossableTransitions(core, [1, 1, 0, 0, 0, 0, 0, 0, 0, 0]));
console.warn(buildSequence(core, [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], ["T2", "T3b","T5a","T6","T7","T8b","T9a","T7","T8a","T10"]));
var simulationSet = useSimulation(core, ["T2", "T3b","T5a","T6","T7","T8b","T9a","T7","T8a","T10"]);
console.log(simulationSet.currentMarking.value);
simulationSet.nextStep();
console.log(simulationSet.currentMarking.value);
</script>

<template>
  <PagePrincipale />
</template>
