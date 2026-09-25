<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  scenarios:   { type: Array,   default: () => [] },
  isFirstStep: { type: Boolean, required: true },
  isLastStep:  { type: Boolean, required: true },
})
const emit = defineEmits(['nextStep', 'previousStep', 'scenarioChanged', 'reset'])

// --- questions : une seule source de vérité pour ids, names et valeurs
const questions = [
  { key: 'reparation', label: 'Réparation',
    options: [{ value: 'required', label: 'Requise' }, { value: 'not required', label: 'Non requise' }] },
  { key: 'piecesPreTest', label: 'Pièces avant test',
    showIf: (c) => c.reparation === 'required',
    options: [{ value: 'available', label: 'Disponibles' }, { value: 'unavailable', label: 'Indisponibles' }] },
  { key: 'testResult', label: 'Résultat du test',
    showIf: (c) => c.reparation === 'required',
    options: [{ value: 'passed', label: 'Réussi' }, { value: 'failed', label: 'Échoué' }] },
 { key: 'newPiecesRequired', label: 'Nouvelles pièces',
  showIf: (c) => c.reparation === 'required' && c.testResult === 'failed',
  options: [{ value: 'required', label: 'Requises' }, { value: 'not required', label: 'Non requises' }] },
{ key: 'piecesPostTest', label: 'Pièces après test',
  showIf: (c) => c.reparation === 'required' && c.testResult === 'failed' && c.newPiecesRequired === 'required',
  options: [{ value: 'available', label: 'Disponibles' }, { value: 'unavailable', label: 'Indisponibles' }] },
]

// --- état
const choices = reactive({
  reparation: null, piecesPreTest: null, testResult: null,
  newPiecesRequired: null, piecesPostTest: null,
})

// --- dérivés
const isLocked = computed(() => !props.isFirstStep)

const visibleQuestions = computed(() =>
  questions.filter((q) => !q.showIf || q.showIf(choices))
)

const answeredSummary = computed(() =>
  visibleQuestions.value
    .filter((q) => choices[q.key] !== null)
    .map((q) => ({
      key: q.key,
      label: q.label,
      value: q.options.find((o) => o.value === choices[q.key])?.label ?? choices[q.key],
    }))
)

const matchedScenario = computed(() =>
  props.scenarios.find((s) =>
    Object.entries(s.conditions).every(
      ([key, expected]) => expected === null || expected === choices[key]
    )
  ) ?? null
)

// --- effets
// une question masquée perd sa réponse (évite un faux match avec une vieille valeur)
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
  <aside
    class="h-full w-full max-w-xs shrink-0 flex flex-col overflow-hidden border-l border-[#1C1F26] bg-[#0A0B0E] font-mono text-[#C9CDD4]"
  >
    <!-- En-tête (fixe) -->
    <header class="flex items-end justify-between border-b border-[#1C1F26] px-5 py-4">
      <div>
        <p class="text-[10px] uppercase tracking-[0.25em] text-[#5C6270]">Simulation</p>
        <h2 class="text-xl font-bold tracking-tight text-white">Scénario</h2>
      </div>
      <span
        class="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
        :class="matchedScenario ? 'bg-[#D4FF3F] text-[#0A0B0E]' : 'border border-[#3A3F4A] text-[#5C6270]'"
      >
        {{ matchedScenario ? matchedScenario.name : 'Incomplet' }}
      </span>
    </header>

    <!-- Zone centrale (défile si nécessaire) -->
    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

      <!-- Verrou -->
      <div
        v-if="isLocked"
        class="flex items-center justify-between gap-3 border border-[#D4FF3F]/40 bg-[#D4FF3F]/5 px-3 py-2"
      >
        <span class="flex items-center gap-2 text-xs text-[#D4FF3F]">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D4FF3F]" />
          En cours
        </span>
        <button
          class="text-xs uppercase tracking-widest text-[#C9CDD4] underline-offset-4 hover:text-[#D4FF3F] hover:underline"
          @click="emit('reset')"
        >
          ⟲ Nouveau
        </button>
      </div>

      <!-- Mode édition -->
      <template v-if="!isLocked">
        <fieldset v-for="(q, i) in visibleQuestions" :key="q.key" class="flex flex-col">
          <legend class="mb-1.5 flex items-baseline gap-2 text-[10px] uppercase tracking-[0.2em] text-[#5C6270]">
            <span class="text-[#D4FF3F]">0{{ i + 1 }}</span>
            {{ q.label }}
          </legend>
          <div class="grid grid-cols-2 gap-px bg-[#1C1F26]">
            <label
              v-for="opt in q.options"
              :key="opt.value"
              :for="`${q.key}-${opt.value}`"
              class="cursor-pointer px-3 py-2 text-center text-sm transition-colors"
              :class="choices[q.key] === opt.value
                ? 'bg-[#D4FF3F] font-bold text-[#0A0B0E]'
                : 'bg-[#0A0B0E] text-[#8B9099] hover:bg-[#13151B] hover:text-white'"
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
      </template>

      <!-- Mode simulation : résumé -->
      <dl v-else class="flex flex-col divide-y divide-[#1C1F26] border-y border-[#1C1F26]">
        <div
          v-for="(a, i) in answeredSummary"
          :key="a.key"
          class="flex items-baseline justify-between gap-3 py-2 text-xs"
        >
          <dt class="flex items-baseline gap-2 uppercase tracking-[0.15em] text-[#5C6270]">
            <span class="text-[#D4FF3F]">0{{ i + 1 }}</span>
            {{ a.label }}
          </dt>
          <dd class="font-bold text-[#C9CDD4]">{{ a.value }}</dd>
        </div>
      </dl>

      <!-- Description -->
      <p
        class="border-l-2 pl-3 text-xs leading-relaxed"
        :class="matchedScenario ? 'border-[#D4FF3F] text-[#C9CDD4]' : 'border-[#3A3F4A] text-[#5C6270]'"
      >
        {{ matchedScenario ? matchedScenario.description : 'Répondez aux questions pour sélectionner un scénario.' }}
      </p>
    </div>

    <!-- Navigation (fixe en bas) -->
    <div class="grid grid-cols-2 gap-px border-t border-[#1C1F26] bg-[#1C1F26]">
      <button
        :disabled="isFirstStep"
        class="bg-[#0A0B0E] px-3 py-3 text-xs uppercase tracking-widest text-[#C9CDD4] transition-colors hover:bg-[#13151B] hover:text-white disabled:cursor-not-allowed disabled:text-[#3A3F4A] disabled:hover:bg-[#0A0B0E]"
        @click="emit('previousStep')"
      >
        ← Préc.
      </button>
      <button
        :disabled="isLastStep || !matchedScenario"
        class="bg-[#D4FF3F] px-3 py-3 text-xs font-bold uppercase tracking-widest text-[#0A0B0E] transition-colors hover:bg-[#E4FF6E] disabled:cursor-not-allowed disabled:bg-[#1C1F26] disabled:text-[#3A3F4A]"
        @click="emit('nextStep')"
      >
        Suiv. →
      </button>
    </div>
  </aside>
</template>