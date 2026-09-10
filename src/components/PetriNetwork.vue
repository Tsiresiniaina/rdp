<script setup>
import { computed } from "vue";
import { buildArcs } from "../logic/buildArcs";
import { arcCurvatures } from "../logic/arcs";
const props = defineProps({
  core: { type: Object, required: true },
  layout: { type: Object, required: true },
  marking: { type: Array, required: true },
});

const arcs = computed(() => buildArcs(props.core));

function pos(id) {
  return props.layout[id] ?? { x: 0, y: 0 };
}
function arcPath(arc) {
  const curvature = curvatureOf(arc)
  const a = pos(arc.from)
  const b = pos(arc.to)

  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const cx = mx + (-dy / len) * curvature
  const cy = my + ( dx / len) * curvature

  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}
function curvatureOf(arc) {
  return arcCurvatures[arc.id] ?? 0
}
</script>

<template>
  <svg
    class="bg-amber-500 h-screen w-full block"
    viewBox="0 0 1300 670"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
      </marker>
    </defs>

    <!-- Couche 1 : les arcs (lignes + flèches) -->
    <path
      v-for="arc in arcs"
      :key="arc.id"
      :d="arcPath(arc)"
      fill="none"
      stroke="black"
      stroke-width="1.5"
      marker-end="url(#arrow)"
    />

    <!-- Couche 2 : les places (cercle + id + jetons) -->
    <g v-for="(place, index) in core.places" :key="place.id">
      <title>{{ place.name }}</title>
      <circle
        :cx="pos(place.id).x"
        :cy="pos(place.id).y"
        r="17"
        fill="white"
        stroke="black"
        stroke-width="1.5"
      />
      <text
        :x="pos(place.id).x"
        :y="pos(place.id).y - 26"
        text-anchor="middle"
        font-size="12"
      >
        {{ place.id }}
      </text>
      <!-- Jetons : petite grille pour qu'ils ne se superposent pas -->
      <g v-if="marking[index] > 0">
        <circle
          v-for="k in marking[index]"
          :key="k"
          :cx="pos(place.id).x + (((k - 1) % 3) - 1) * 11"
          :cy="pos(place.id).y + (Math.floor((k - 1) / 3) - 0) * 11"
          r="4.5"
          fill="black"
        />
      </g>
    </g>

    <!-- Couche 3 : les transitions (barre + id) -->
    <g v-for="transition in core.transitions" :key="transition.id">
      <title>{{ transition.name }}</title>
      <rect
        :x="pos(transition.id).x - 6"
        :y="pos(transition.id).y - 21"
        width="12"
        height="42"
        fill="black"
      />
      <text
        :x="pos(transition.id).x"
        :y="pos(transition.id).y - 30"
        text-anchor="middle"
        font-size="12"
      >
        {{ transition.id }}
      </text>
    </g>
  </svg>
</template>
