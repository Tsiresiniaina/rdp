<script setup>
import { core } from "./data/core.js";
import { layout } from "./logic/layout.js";
import { useSimulation } from "./composables/useSimulation.js";
import PetriNetwork from "./components/PetriNetwork.vue";
import ControlPanel from "./components/ControlPanel.vue";
import { scenariosList } from "./data/scenariosList.js";

const {
  currentMarking,
  stepIndex,
  isFirstStep,
  isLastStep,
  nextStep,
  previousStep,
  reset,
  loadSequence,
} = useSimulation(core, scenariosList[0].sequence);

function changeScenario(scenarioId) {
  console.log("Scenario sélectionné :", scenarioId);
  const selectedScenario = scenariosList.find((s) => s.id === scenarioId);
  if (!selectedScenario) return;
  loadSequence(selectedScenario.sequence);
}
console.log("currentMarking =", JSON.stringify(currentMarking.value));
</script>

<template>
  <div class="flex flex-row gap-4">
    <PetriNetwork :core="core" :layout="layout" :marking="currentMarking" />
    <ControlPanel
      :scenarios="scenariosList"
      :isFirstStep="isFirstStep"
      :isLastStep="isLastStep"
      @nextStep="nextStep"
      @previousStep="previousStep"
      @scenarioChanged="changeScenario"
    />
  </div>
</template>
