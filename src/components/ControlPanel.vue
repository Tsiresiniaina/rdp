<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  scenarios:   { type: Array,   default: () => [] },
  isFirstStep: { type: Boolean, required: true },
  isLastStep:  { type: Boolean, required: true },
})
const emit = defineEmits(['nextStep', 'previousStep', 'scenarioChanged', 'reset']) // ★

const questions = [
  { key: 'reparation', label: 'Réparation',
    options: [{ value: 'required', label: 'Requise' }, { value: 'not required', label: 'Non requise' }] },
  { key: 'piecesPreTest', label: 'Pièces avant test',
    showIf: (c) => c.reparation === 'required',
    options: [{ value: 'available', label: 'Disponibles' }, { value: 'unavailable', label: 'Indisponibles' }] },
  { key: 'testResult', label: 'Résultat du test',
    showIf: (c) => c.reparation === 'required',
    options: [{ value: 'passed', label: 'Réussi' }, { value: 'failed', label: 'Échoué' }] },
  { key: 'piecesPostTest', label: 'Pièces après test',
    showIf: (c) => c.reparation === 'required' && c.testResult === 'failed',
    options: [{ value: 'available', label: 'Disponibles' }, { value: 'unavailable', label: 'Indisponibles' }] },
]

const choices = reactive({
  reparation: null, piecesPreTest: null, testResult: null, piecesPostTest: null,
})

// ★ verrouillé dès qu'on a quitté l'étape 0
const isLocked = computed(() => !props.isFirstStep)

const visibleQuestions = computed(() =>
  questions.filter((q) => !q.showIf || q.showIf(choices))
)

const matchedScenario = computed(() =>
  props.scenarios.find((s) =>
    Object.entries(s.conditions).every(
      ([key, expected]) => expected === null || expected === choices[key]
    )
  ) ?? null
)

watch(visibleQuestions, (visible) => {
  const visibleKeys = new Set(visible.map((q) => q.key))
  for (const q of questions) {
    if (!visibleKeys.has(q.key)) choices[q.key] = null
  }
})

watch(matchedScenario, (scenario) => {
  if (scenario) emit('scenarioChanged', scenario.id)
})
</script>

<template>
  <aside class="w-full max-w-xs flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <header class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-800">Scénario</h2>
      <span
        class="rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="matchedScenario ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
      >
        {{ matchedScenario ? matchedScenario.name : 'Incomplet' }}
      </span>
    </header>

    <!-- ★ Bandeau + bouton quand la simulation est en cours -->
    <div
      v-if="isLocked"
      class="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
    >
      <span>Simulation en cours — choix verrouillés</span>
      <button
        class="shrink-0 rounded-md border border-amber-300 bg-white px-2 py-1 font-medium text-amber-800 hover:bg-amber-100"
        @click="emit('reset')"
      >
        ⟲ Nouveau scénario
      </button>
    </div>

    <fieldset
      v-for="q in visibleQuestions"
      :key="q.key"
      :disabled="isLocked"
      class="flex flex-col gap-2"
      :class="isLocked && 'opacity-60'"
    >
      <legend class="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {{ q.label }}
      </legend>
      <div class="grid grid-cols-2 gap-2">
        <label
          v-for="opt in q.options"
          :key="opt.value"
          :for="`${q.key}-${opt.value}`"
          class="rounded-lg border px-3 py-2 text-center text-sm transition"
          :class="[
            isLocked ? 'cursor-not-allowed' : 'cursor-pointer',
            choices[q.key] === opt.value
              ? 'border-blue-500 bg-blue-50 font-medium text-blue-700'
              : 'border-slate-200 text-slate-600',
            !isLocked && choices[q.key] !== opt.value && 'hover:border-slate-300 hover:bg-slate-50',
          ]"
        >
          <input
            v-model="choices[q.key]"
            type="radio"
            class="sr-only"
            :id="`${q.key}-${opt.value}`"
            :name="q.key"
            :value="opt.value"
          />
          {{ opt.label }}
        </label>
      </div>
    </fieldset>

    <p class="min-h-[2.5rem] rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
      {{ matchedScenario ? matchedScenario.description : 'Répondez aux questions pour sélectionner un scénario.' }}
    </p>

    <div class="mt-auto flex gap-2 border-t border-slate-200 pt-4">
      <button
        :disabled="isFirstStep"
        class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        @click="emit('previousStep')"
      >
        ← Précédent
      </button>
      <button
        :disabled="isLastStep || !matchedScenario"
        class="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        @click="emit('nextStep')"
      >
        Suivant →
      </button>
    </div>
  </aside>
</template>