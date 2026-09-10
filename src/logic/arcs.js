// Courbure par arc, en unités du viewBox.
// Clé = id de l'arc généré par createArc : `${from}-${to}-${kind}`
//   - kind 'pre'  : place → transition   ex. 'P1-T2-pre'
//   - kind 'post' : transition → place   ex. 'T4-P2-post'
// Valeur : 0 = droite ; positif = bombe d'un côté ; négatif = de l'autre.
// Un arc absent de la table est droit.
export const arcCurvatures = {
  'T10-P2-post': -60,
  'T9b-P5-post': 80,
  'T9a-P7-post': 20,
  'T8b-P10-post': 20,
  'P10-T9b-pre': 40,
  'T6-P7-post': 40,
  'P8-T8a-pre': 20,
  'P8-T8b-pre': -20,
  'P9-T10-pre': -60,
  'P4-T4-pre': -60,
  'P1-T2-pre': 30,
  'P2-T2-pre': -30,
  'P3-T3a-pre': 30,
  'P3-T3b-pre': -30,
  'T3b-P5-post': 30,
  'P5-T5a-pre': 30,
  'P5-T5b-pre': -30,
}