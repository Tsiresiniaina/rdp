<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import PagePrincipale from "./components/PagePrincipale.vue";
import { core } from "./data/core.js";
import { validateCore } from "./data/validateCore.js";
import { isCrossable } from "./logic/engine.js";
import { fire } from "./logic/engine.js";
import { getCrossableTransitions } from "./logic/engine.js";
import { buildSequence } from "./logic/sequence.js";
const errors = validateCore(core);
console.log(errors);
console.log(isCrossable(core, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], "T2"));
console.log(fire(core, [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], "T2"));
console.log(getCrossableTransitions(core, [1, 1, 0, 0, 0, 0, 0, 0, 0, 0]));
console.warn(buildSequence(core, [0, 0, 1, 0, 0, 0, 0, 0, 0, 0], ["T3a", "T4"]));
</script>

<template>
  <PagePrincipale />
</template>
