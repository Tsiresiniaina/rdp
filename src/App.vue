<script setup>
import HelloWorld from './components/HelloWorld.vue'
import PagePrincipale from './components/PagePrincipale.vue'
import { core } from './data/core.js'
import { validateCore } from './data/validateCore.js'

const errors = validateCore(core);
console.log(errors);
</script>

<template>
  <PagePrincipale />
</template>
