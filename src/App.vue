<script setup>
import { core } from './data/core.js'
import { layout } from './logic/layout.js'
import { useSimulation } from './composables/useSimulation.js'
import PetriNetwork from './components/PetriNetwork.vue'

// Remplace par UNE séquence valide de TON réseau (sinon buildSequence throw)
const { currentMarking, stepIndex, isFirstStep, isLastStep, nextStep, previousStep } =
  useSimulation(core, ['T2', 'T3a', 'T4'])
</script>

<template>
  <div>
    <PetriNetwork :core="core" :layout="layout" :marking="currentMarking" />
    <!-- <div style="margin-top: 12px">
      <button :disabled="isFirstStep" @click="previousStep">← Précédent</button>
      <span style="margin: 0 12px">Étape {{ stepIndex }}</span>
      <button :disabled="isLastStep" @click="nextStep">Suivant →</button>
    </div> -->
  </div>
</template>