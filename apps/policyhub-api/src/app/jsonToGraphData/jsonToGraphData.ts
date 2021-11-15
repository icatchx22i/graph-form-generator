import { makeNode } from "./node";

export function makeJsonToGraphDataService({ dataService }) {
    return {
        jsonToGraph: async (jsonSchema) => {
            const nodes = getFreeNodes(jsonSchema);
            const nodeWithDependencies = getDependentNodes(jsonSchema);
            // nodes.forEach(node => {
            //     // const nodeData = makeNode(node);
            //     dataService.save(node);
            // });
            for (const node of nodes) {
                await dataService.save({ policyItemSpec: node, processType: jsonSchema.title }); 
            }

            for(const tuple of nodeWithDependencies) {
                await dataService.saveWithRelations(tuple);
            }
        }
    }
}


const getFreeNodes = (jsonSchema) => {
    return Object.keys(jsonSchema.properties).map(spec => {
        return makeNode({ name: spec, specs: jsonSchema });
    })
}

// the tuples returned from this feel like they should be pivoted. 
// This should return 1 item per child instead of 1 per parent
const getDependentNodes = (jsonSchema) => {
    return Object.keys(jsonSchema.dependencies).map(fieldWithDependencies => {
        const subSchema = { ...jsonSchema.dependencies[fieldWithDependencies], title: jsonSchema.title };
        return [fieldWithDependencies, getFreeNodes(subSchema)];
    }) 
}

/*
jsonToGraph 
    1. accept a jsonSchema object
    2. turn properties to nodes
    3. turn dependencies to related nodes
        - we dont support specific values yet.. just basic stuff.
        - dont support nested dependencies. I dont like how the Form UI / JSON Generator is handling these. too complicated.


*/