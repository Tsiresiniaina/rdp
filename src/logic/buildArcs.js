import { createArc } from "../models/arcModel.js";
export function buildArcs(core){
let arc = [];
// Build arcs from places to transitions
for(let i =0; i < core.matricePre.length; i++){
    for(let j = 0; j < core.matricePre[i].length; j++){
        if(core.matricePre[i][j] > 0){
        let newArc = createArc({
                from : core.places[i].id,
                to : core.transitions[j].id,
                weight : core.matricePre[i][j],
                kind : "pre"
            });
            arc.push(newArc);
        }
    }
}
for (let i =0; i < core.matricePost.length; i++){
    for(let j = 0; j < core.matricePost[i].length; j++){
        if(core.matricePost[i][j] > 0){
            let newArc = createArc({
                from : core.transitions[j].id,
                to : core.places[i].id,
                weight : core.matricePost[i][j],
                kind : "post"
            });
            arc.push(newArc);
        }   
}
}
return arc;
}