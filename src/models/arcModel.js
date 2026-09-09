
export const createArc = (data = {}) => {
    if(!data.from|| data.from===""|| !data.to|data.to==="") {
        throw new Error("from and to are required");
    }
    if(!data.weight || data.weight < 1){
        throw new Error("weight must be greater than 0");
    }
    if(!data.kind || (data.kind !== "pre" && data.kind !== "post")){
        throw new Error("kind must be 'pre' or 'post'");
    }
    return {
        id:`${data.from}-${data.to}-${data.kind}`,
        from : data.from,
        to : data.to,
        weight : data.weight,
        kind : data.kind
    };
};
