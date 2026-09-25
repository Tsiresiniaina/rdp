export const scenariosList = [
  {
    id: "scenario1",
    name: "Scénario 1",
    description: "Le téléphone n’est pas réparé et est retourné au client.",
    sequence: ["T2", "T3a", "T4"],
    conditions: {
      reparation: "not required",
      piecesPreTest: null,
      testResult: null,
      newPiecesRequired: null,
      piecesPostTest: null,
    },
  },
  {
    id: "scenario2",
    name: "Scénario 2",
    description:
      "Pièces indisponibles, test échoué : commande des pièces, réparation, nouvelles pièces requises et disponibles, second test réussi.",
    sequence: ["T2", "T3b", "T5a", "T6", "T7", "T8b", "T9b", "T5b", "T7", "T8a", "T10"],
    conditions: {
      reparation: "required",
      piecesPreTest: "unavailable",
      testResult: "failed",
      newPiecesRequired: "required",
      piecesPostTest: "available",
    },
  },
  {
    id: "scenario3",
    name: "Scénario 3",
    description:
      "Pièces indisponibles, test réussi : commande des pièces puis réparation validée.",
    sequence: ["T2", "T3b", "T5a", "T6", "T7", "T8a", "T10"],
    conditions: {
      reparation: "required",
      piecesPreTest: "unavailable",
      testResult: "passed",
      newPiecesRequired: null,
      piecesPostTest: null,
    },
  },
  {
    id: "scenario4",
    name: "Scénario 4",
    description:
      "Pièces disponibles, test échoué : nouvelles pièces requises et disponibles, reprise de la réparation puis second test réussi.",
    sequence: ["T2", "T3b", "T5b", "T7", "T8b", "T9b", "T5b", "T7", "T8a", "T10"],
    conditions: {
      reparation: "required",
      piecesPreTest: "available",
      testResult: "failed",
      newPiecesRequired: "required",
      piecesPostTest: "available",
    },
  },
  {
    id: "scenario5",
    name: "Scénario 5",
    description:
      "Pièces disponibles, test échoué : nouvelles pièces requises mais indisponibles, commande puis second test réussi.",
    sequence: ["T2", "T3b", "T5b", "T7", "T8b", "T9b", "T5a", "T6", "T7", "T8a", "T10"],
    conditions: {
      reparation: "required",
      piecesPreTest: "available",
      testResult: "failed",
      newPiecesRequired: "required",
      piecesPostTest: "unavailable",
    },
  },
  {
    id: "scenario6",
    name: "Scénario 6",
    description: "Pièces disponibles, test réussi : réparation directe et retour au client.",
    sequence: ["T2", "T3b", "T5b", "T7", "T8a", "T10"],
    conditions: {
      reparation: "required",
      piecesPreTest: "available",
      testResult: "passed",
      newPiecesRequired: null,
      piecesPostTest: null,
    },
  },
  {
    id: "scenario7",
    name: "Scénario 7",
    description:
      "Pièces indisponibles, test échoué : nouvelles pièces requises et à nouveau indisponibles, seconde commande puis test réussi.",
    sequence: ["T2", "T3b", "T5a", "T6", "T7", "T8b", "T9b", "T5a", "T6", "T7", "T8a", "T10"],
    conditions: {
      reparation: "required",
      piecesPreTest: "unavailable",
      testResult: "failed",
      newPiecesRequired: "required",
      piecesPostTest: "unavailable",
    },
  },
  {
    id: "scenario8",
    name: "Scénario 8",
    description:
      "Pièces disponibles, test échoué sans nouvelle pièce : reprise directe de la réparation puis second test réussi.",
    sequence: ["T2", "T3b", "T5b", "T7", "T8b", "T9a", "T7", "T8a", "T10"],
    conditions: {
      reparation: "required",
      piecesPreTest: "available",
      testResult: "failed",
      newPiecesRequired: "not required",
      piecesPostTest: null,
    },
  },
  {
    id: "scenario9",
    name: "Scénario 9",
    description:
      "Pièces indisponibles, test échoué sans nouvelle pièce : commande initiale, reprise directe puis second test réussi.",
    sequence: ["T2", "T3b", "T5a", "T6", "T7", "T8b", "T9a", "T7", "T8a", "T10"],
    conditions: {
      reparation: "required",
      piecesPreTest: "unavailable",
      testResult: "failed",
      newPiecesRequired: "not required",
      piecesPostTest: null,
    },
  },
];