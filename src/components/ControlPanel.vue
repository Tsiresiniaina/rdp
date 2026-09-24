<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  scenarios: { type: Array, required: true },
  isFirstStep: { type: Boolean, required: true },
  isLastStep: { type: Boolean, required: true },
});
const emit = defineEmits(["nextStep", "previousStep", "scenarioChanged"]);

// Valeurs = exactement celles des `conditions` de scenarios.js
const questions = [
  {
    key: "reparation",
    label: "Réparation",
    options: [
      { value: "required", label: "Requise" },
      { value: "not required", label: "Non requise" },
    ],
  },
  {
    key: "piecesPreTest",
    label: "Pièces avant test",
    onlyIfRepair: true,
    options: [
      { value: "available", label: "Disponibles" },
      { value: "unavailable", label: "Indisponibles" },
    ],
  },
  {
    key: "testResult",
    label: "Résultat du test",
    onlyIfRepair: true,
    options: [
      { value: "passed", label: "Réussi" },
      { value: "failed", label: "Échoué" },
    ],
  },
  {
    key: "piecesPostTest",
    label: "Pièces après test",
    onlyIfRepair: true,
    options: [
      { value: "available", label: "Disponibles" },
      { value: "unavailable", label: "Indisponibles" },
    ],
  },
];

// --- état
const choices = reactive({
  reparation: null,
  piecesPreTest: null,
  testResult: null,
  piecesPostTest: null,
});

// --- dérivés
const repairRequired = computed(() => choices.reparation === "required");

const visibleQuestions = computed(() =>
  questions.filter((q) => !q.onlyIfRepair || repairRequired.value),
);

const matchedScenario = computed(
  () =>
    props.scenarios.find((s) =>
      Object.entries(s.conditions).every(
        ([key, expected]) => expected === null || expected === choices[key],
      ),
    ) ?? null,
);

// --- effets
// Si la réparation n'est plus requise, on oublie les réponses devenues hors sujet
watch(repairRequired, (required) => {
  if (!required) {
    choices.piecesPreTest = null;
    choices.testResult = null;
    choices.piecesPostTest = null;
  }
});

watch(matchedScenario, (scenario) => {
  if (scenario) emit("scenarioChanged", scenario.id);
});
</script>

<template>
  <div class="w-1/4 p-1 flex flex-col items-center justify-between">
    <h2>Control Panel</h2>

    <div v-for="q in visibleQuestions" :key="q.key" class="flex flex-col gap-2">
      <h3>{{ q.label }}</h3>
      <div class="flex flex-row gap-2">
        <div v-for="opt in q.options" :key="opt.value">
          <input
            v-model="choices[q.key]"
            type="radio"
            :id="`${q.key}-${opt.value}`"
            :name="q.key"
            :value="opt.value"
          />
          <label :for="`${q.key}-${opt.value}`">{{ opt.label }}</label>
        </div>
      </div>
    </div>

    <p class="text-sm">
      {{
        matchedScenario
          ? matchedScenario.description
          : "Aucun scénario ne correspond"
      }}
    </p>

    <div class="flex flex-row gap-2 py-2">
      <button
        :disabled="isFirstStep"
        class="rounded p-2 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 disabled:opacity-50"
        @click="emit('previousStep')"
      >
        Précédent
      </button>
      <button
        :disabled="isLastStep"
        class="rounded p-2 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 disabled:opacity-50"
        @click="emit('nextStep')"
      >
        Suivant
      </button>
    </div>
  </div>
</template>
