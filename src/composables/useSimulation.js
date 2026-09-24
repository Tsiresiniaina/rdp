import { computed, ref } from "vue";
import { buildSequence } from "../logic/sequence.js";

export function useSimulation(core, initialSequence) {
  console.log("A initialSequence =", initialSequence);
  const sequence = ref([...initialSequence]);
  console.log("B sequence.value =", sequence.value);
  const stepIndex = ref(0);

  const markings = computed(() => {
    console.log("C sequence.value =", sequence.value);
    return buildSequence(core,core.initialMarking, sequence.value);
  });
// --- dérivés
const steps = computed(() => buildSequence(core, core.initialMarking, sequence.value))
const currentStep = computed(() => steps.value[stepIndex.value])
const currentMarking = computed(() => currentStep.value.marking)
const currentFireId = computed(() => currentStep.value.fireId)

const isFirstStep = computed(() => stepIndex.value === 0)
const isLastStep = computed(() => stepIndex.value === steps.value.length - 1)

  function nextStep() {
    if (!isLastStep.value) stepIndex.value++;
  }
  function previousStep() {
    if (!isFirstStep.value) stepIndex.value--;
  }
  function reset() {
    stepIndex.value = 0;
  }

  function loadSequence(newSequence) {
    sequence.value = [...newSequence];
    stepIndex.value = 0;
  }

  return {
    sequence,
    stepIndex,
    currentMarking,
    isFirstStep,
    isLastStep,
    currentFireId,
    nextStep,
    previousStep,
    reset,
    loadSequence,
  };
}
