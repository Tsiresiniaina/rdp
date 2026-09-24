<script setup>
import { computed } from "vue";
import { buildArcs } from "../logic/buildArcs";
import { arcCurvatures } from "../logic/arcs";

const props = defineProps({
  core: { type: Object, required: true },
  layout: { type: Object, required: true },
  marking: { type: Array, required: true },
  fireId: { type: String, default: null },
  crossableIds: { type: Array, default: () => [] },
});

// --- palette
const BG = "#0A0B0E";
const GRID = "#16181D";
const LINE = "#3A3F4A";
const FG = "#C9CDD4";
const ACID = "#D4FF3F";

const arcs = computed(() => buildArcs(props.core));
const placeIds = computed(() => new Set(props.core.places.map((p) => p.id)));
const crossableSet = computed(() => new Set(props.crossableIds));

const PLACE_RADIUS = 17 + 3;
const HALF_W = 6 + 3;
const HALF_H = 21 + 3;

function edgeOffset(id, ux, uy) {
  if (placeIds.value.has(id)) return PLACE_RADIUS;
  const dxEdge = ux !== 0 ? HALF_W / Math.abs(ux) : Infinity;
  const dyEdge = uy !== 0 ? HALF_H / Math.abs(uy) : Infinity;
  return Math.min(dxEdge, dyEdge);
}
function pos(id) { return props.layout[id] ?? { x: 0, y: 0 }; }
function curvatureOf(arc) { return arcCurvatures[arc.id] ?? 0; }
function arcPath(arc) {
  const curvature = curvatureOf(arc);
  const a = pos(arc.from), b = pos(arc.to);
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * curvature, cy = my + (dx / len) * curvature;
  const tx = b.x - cx, ty = b.y - cy;
  const tlen = Math.hypot(tx, ty) || 1;
  const ux = tx / tlen, uy = ty / tlen;
  const offset = edgeOffset(arc.to, ux, uy);
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x - ux * offset} ${b.y - uy * offset}`;
}
function arcIsActive(arc) {
  return props.fireId !== null && (arc.from === props.fireId || arc.to === props.fireId);
}
function transitionState(id) {
  if (id === props.fireId) return "fired";
  if (crossableSet.value.has(id)) return "crossable";
  return "idle";
}
</script>

<template>
  <svg
    class="h-screen w-full block"
    viewBox="0 0 1300 670"
    preserveAspectRatio="xMidYMid meet"
    :style="{ background: BG, fontFamily: 'ui-monospace, \'JetBrains Mono\', Menlo, monospace' }"
  >
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" :stroke="GRID" stroke-width="1" />
      </pattern>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" :fill="LINE" />
      </marker>
      <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" :fill="ACID" />
      </marker>
      <!-- lueur douce, réservée à l'accent -->
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <rect width="1300" height="670" fill="url(#grid)" />

    <!-- Couche 1 : arcs -->
    <g>
      <path
        v-for="arc in arcs" :key="arc.id"
        :d="arcPath(arc)" fill="none"
        :stroke="arcIsActive(arc) ? ACID : LINE"
        :stroke-width="arcIsActive(arc) ? 2 : 1.4"
        :stroke-dasharray="arcIsActive(arc) ? '6 6' : 'none'"
        :marker-end="arcIsActive(arc) ? 'url(#arrow-active)' : 'url(#arrow)'"
        :class="arcIsActive(arc) && 'flow'"
      />
    </g>

    <!-- Couche 2 : places -->
    <g v-for="(place, index) in core.places" :key="place.id">
      <title>{{ place.name }}</title>
      <circle
        :cx="pos(place.id).x" :cy="pos(place.id).y" r="17"
        :fill="BG" :stroke="marking[index] > 0 ? FG : LINE" stroke-width="1.6"
        style="transition: stroke 250ms"
      />
      <text
        :x="pos(place.id).x" :y="pos(place.id).y - 25"
        text-anchor="middle" font-size="11" letter-spacing="1.5"
        :fill="marking[index] > 0 ? FG : LINE"
      >{{ place.id }}</text>

      <g filter="url(#glow)">
        <circle
          v-if="marking[index] === 1"
          :cx="pos(place.id).x" :cy="pos(place.id).y" r="6" :fill="ACID"
        />
        <circle
          v-else-if="marking[index] > 1"
          v-for="k in marking[index]" :key="k"
          :cx="pos(place.id).x + (((k - 1) % 3) - 1) * 10"
          :cy="pos(place.id).y + (Math.floor((k - 1) / 3) - 0.5) * 10"
          r="4" :fill="ACID"
        />
      </g>
    </g>

    <!-- Couche 3 : transitions -->
    <g v-for="transition in core.transitions" :key="transition.id">
      <title>{{ transition.name }}</title>

      <!-- anneau pulsant de la transition franchie -->
      <rect
        v-if="transitionState(transition.id) === 'fired'"
        :x="pos(transition.id).x - 12" :y="pos(transition.id).y - 27"
        width="24" height="54" rx="3"
        fill="none" :stroke="ACID" stroke-width="1.5"
        class="pulse"
      />
      <rect
        :x="pos(transition.id).x - 6" :y="pos(transition.id).y - 21"
        width="12" height="42" rx="1"
        :fill="transitionState(transition.id) === 'fired' ? ACID
             : transitionState(transition.id) === 'crossable' ? BG : FG"
        :stroke="transitionState(transition.id) === 'crossable' ? ACID : 'none'"
        stroke-width="1.6"
        :filter="transitionState(transition.id) === 'fired' ? 'url(#glow)' : undefined"
        style="transition: fill 250ms"
      />
      <text
        :x="pos(transition.id).x" :y="pos(transition.id).y - 32"
        text-anchor="middle" font-size="11" letter-spacing="1.5"
        :fill="transitionState(transition.id) === 'fired' ? ACID : FG"
        :font-weight="transitionState(transition.id) === 'fired' ? 700 : 400"
      >{{ transition.id }}</text>
    </g>
  </svg>
</template>

<style scoped>
/* les pointillés défilent dans le sens du flux */
.flow { animation: flow 0.8s linear infinite; }
@keyframes flow { to { stroke-dashoffset: -12; } }

/* l'anneau respire */
.pulse { transform-box: fill-box; transform-origin: center; animation: pulse 1.6s ease-in-out infinite; }
@keyframes pulse {
  0%, 100% { opacity: 0.9; transform: scale(1); }
  50%      { opacity: 0.2; transform: scale(1.25); }
}
</style>