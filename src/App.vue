<script setup>
import HelloWorld from './components/HelloWorld.vue'
import PagePrincipale from './components/PagePrincipale.vue'
import { core } from './data/core.js'
import { validateCore } from './data/validateCore.js'
import { isCrossable } from './logic/engine.js'
const errors = validateCore(core);
console.log(errors);
console.log(isCrossable(core, [1,0,0,0,0,0,0,0,0,0], 'T2'));
</script>
<template>
  <PagePrincipale />
</template>
