export const core = {
// DESCRITION DES PLACES
places  :  [
    {
        id : "P1",
        name : "Téléphone déposé"
    },
    {
        id:"P2",
        name:"Téchnicien libre"
    },
    {
        id:"P3",
        name:"Diagnostic terminé"
    },
    {
        id : "P4",
        name : "Téléphone restitué au client"
    },
    {
        id : "P5",
        name : "Téléphone pris en charge"
    },
    {
        id : "P6",
        name : "Téléphone en attente de pièces"
    },
    {
        id : "P7",
        name : "Téléphone prêt pour la réparation"
    },
    {
        id : "P8",
        name : "Réparation terminé"
    },
    {
        id : "P9",
        name : "Téléphone réparé"
    },
    {
        id : "P10",
        name : "Echec de la réparation"
    }
],
// DESCRIPTIONS DES TRANSISTIONS
transitions  :   [
    {
        id  :  "T1",
        name  :  "Arrivée du client"
    },
    {
        id  :  "T2",
        name  :  "Diagnostic du téléphone"
    },
    {
        id  :  "T3a",
        name  :  "Reparation non requise"
    },
    {
        id  :  "T3b",
        name  :  "Réparation requise"
    },
    {
        id  :  "T4",
        name  :  "Restituer le téléphone au client"
    },
    {
        id  :  "T5a",
        name  :  "Pièces indisponibles"
    },
    {
        id  :  "T5b",
        name  :  "Pièces disponibles"
    },
    {
        id  :  "T6",
        name  :  "Arrivée du client"
    },
    {
        id  :  "T7",
        name  :  "Réparation du téléphone"
    },
    {
        id  :  "T8a",
        name  :  "Test réussi"
    },
    {
        id  :  "T8b",
        name  :  "Test échoué"
    },
    {
        id  :  "T9a",
        name  :  "Aucune nouvelles pièces requises"
    },
    {
        id  :  "T9b",
        name  :  "Nouvelles pièces requises"
    },
    {
        id  :  "T10",
        name  :  "Le client quitte l'atélier"
    }
],
//MATRICES PRE
matricePre  : [
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0], //P1
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0], //P2
    [0,0,1,1,0,0,0,0,0,0,0,0,0,0], //P3
    [0,0,0,0,1,0,0,0,0,0,0,0,0,0], //P4
    [0,0,0,0,0,1,1,0,0,0,0,0,0,0], //P5
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0], //P6
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0], //P7
    [0,0,0,0,0,0,0,0,0,1,1,0,0,0], //P8
    [0,0,0,0,0,0,0,0,0,0,0,0,0,1], //P9
    [0,0,0,0,0,0,0,0,0,0,0,1,1,0], //P10
],
//MATRICES POST
matricePost  : [
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0], //P1
    [0,0,0,0,1,0,0,0,0,0,0,0,0,1], //P2
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0], //P3
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0], //P4
    [0,0,0,1,0,0,0,0,0,0,0,0,1,0], //P5
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0], //P6
    [0,0,0,0,0,0,1,1,0,0,0,1,0,0], //P7
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0], //P8
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0], //P9
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0], //P10
],
//MARQUAGE INITIAL
marquageInitial  : [1,1,0,0,0,0,0,0,0,0]
}