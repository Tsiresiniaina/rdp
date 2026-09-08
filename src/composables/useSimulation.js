import { computed, ref } from "vue";
import { buildSequence } from "../logic/sequence.js";

export function useSimulation(core, transitionIds) {
  const stepIndex = ref(0);
  const sequence = buildSequence(core, core.initialMarking, transitionIds);

  const currentMarking = computed(() => sequence[stepIndex.value].marking);
  const currentTransitionId = computed(() => sequence[stepIndex.value].fireId);
  const isFirstStep = computed(() => stepIndex.value === 0);
  const isLastStep = computed(() => stepIndex.value === sequence.length - 1);

  function nextStep() {
    if (stepIndex.value < sequence.length - 1) {
      stepIndex.value++;
    }
  }
  function previousStep() {
    if (stepIndex.value > 0) {
      stepIndex.value--;
    }
  }

  return {
    stepIndex,
    currentMarking,
    currentTransitionId,
    isFirstStep,
    isLastStep,
    nextStep,
    previousStep,
    sequence,
  };
}