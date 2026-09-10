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
const placeIds = computed(() => new Set(props.core.places.map((p) => p.id)));
const PLACE_RADIUS = 17 + 2; // rayon du cercle + air pour la pointe
const HALF_W = 6 + 2; // demi-largeur du rect + air
const HALF_H = 6 + 2; // demi-hauteur du rect + air

// (ux, uy) = direction unitaire d'arrivée sur le nœud
function edgeOffset(id, ux, uy) {
  if (placeIds.value.has(id)) return PLACE_RADIUS;

  // rectangle : distance jusqu'au premier bord touché dans cette direction
  const dxEdge = ux !== 0 ? HALF_W / Math.abs(ux) : Infinity;
  const dyEdge = uy !== 0 ? HALF_H / Math.abs(uy) : Infinity;
  return Math.min(dxEdge, dyEdge);
}
function pos(id) {
  return props.layout[id] ?? { x: 0, y: 0 };
}
const NODE_RADIUS = 18; // rayon du cercle (17) + un peu d'air pour la pointe
function arcPath(arc) {
  const curvature = curvatureOf(arc);
  const a = pos(arc.from);
  const b = pos(arc.to);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * curvature;
  const cy = my + (dx / len) * curvature;
  // on recule l'arrivée le long de la tangente finale (contrôle → arrivée)
  const tx = b.x - cx;
  const ty = b.y - cy;
  const tlen = Math.hypot(tx, ty) || 1;
  const ux = tx / tlen;
  const uy = ty / tlen;

  const offset = edgeOffset(arc.to, ux, uy);
  const ex = b.x - ux * offset;
  const ey = b.y - uy * offset;

  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${ex} ${ey}`;
}
function curvatureOf(arc) {
  return arcCurvatures[arc.id] ?? 0;
}
</script>

<template>
  <svg
    class="bg-blue-200 h-screen w-full block"
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
