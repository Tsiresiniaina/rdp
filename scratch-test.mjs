import { buildSequence } from './src/logic/sequence.js'

const miniCore = {
  places: [{ id: 'p1' }, { id: 'p2' }],
  transitions: [{ id: 't1' }, { id: 't2' }],
  matricePre: [
    [1, 0], // p1 : t1 consomme 1, t2 ne consomme rien
    [0, 1], // p2 : t2 consomme 1, t1 ne consomme rien
  ],
  matricePost: [
    [0, 1], // t2 produit 1 dans p1
    [1, 0], // t1 produit 1 dans p2
  ],
  initialMarking  : [1, 0] // p1 a 1 jeton, p2 a 0 jeton
}

// Test 1 — séquence vide
console.log('Test 1 :', buildSequence(miniCore, [1, 0], []))
// Attendu : [ { marking: [1,0], fireId: null } ] — UNE seule étape, pas d'erreur

// Test 2 — un tir valide
console.log('Test 2 :', buildSequence(miniCore, [1, 0], ['t1']))
// Attendu : 2 étapes, la dernière avec marking [0,1]

// Test 3 — le cycle complet
console.log('Test 3 :', buildSequence(miniCore, [1, 0], ['t1', 't2']))
// Attendu : 3 étapes, on revient à [1,0]

// Test 4 — tir impossible : t2 a besoin d'un jeton dans p2, il n'y en a pas
try {
  buildSequence(miniCore, [1, 0], ['t2'])
  console.log('Test 4 : ÉCHEC — aurait dû lever une erreur')
} catch (e) {
  console.log('Test 4 : OK — erreur levée :', e.message)
}

// Test 5 — transition qui n'existe pas
try {
  buildSequence(miniCore, [1, 0], ['t99'])
  console.log('Test 5 : ÉCHEC — aurait dû lever une erreur')
} catch (e) {
  console.log('Test 5 : OK — erreur levée :', e.message)
}