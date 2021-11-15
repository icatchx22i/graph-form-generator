import { driver, session, auth } from "neo4j-driver";


let client;
const getInstance = () => {
    if (!client) {
        client = driver("bolt://localhost", auth.basic("alice", "alice"));
    }
    return client;
}

const closeConnection = () => {
    return getInstance().close();
}

const saveWithRelations = async (fieldWithDependenciesTuple) => {
    const parentField = fieldWithDependenciesTuple[0];
    const childFields = fieldWithDependenciesTuple[1];
    //The two steps below could be done as one
    await childFields.map(field => save({ policyItemSpec: field, processType: field.processName }));
    await childFields.map(field => createRelationBetween(field, parentField));
}


const save = ({ policyItemSpec, processType }) => {
    const client = getInstance();
    const dbSession = client.session({
        database: 'neo4j',
        defaultAccessMode: session.WRITE
    })

    const SETArguements = convertParametersToSET(policyItemSpec);
    const query =
        `
    MERGE (process:ProcessDefinition {type: '${processType}'})
    MERGE (policyItemSpec:PolicyItemSpec {fieldName: $fieldName})
    ON CREATE SET
    ${SETArguements.join(', ')},
    policyItemSpec.createdOn = timestamp()
    ON MATCH SET
    ${SETArguements.join(', ')}
    MERGE (policyItemSpec)-[:PART_OF]->(process)
    RETURN policyItemSpec as savedNode, process as Process`;

    return dbSession.writeTransaction(async (tx) => {
        const result = await tx.run(query, {
            fieldName: policyItemSpec['fieldName']
        })
        return result.records.map(record => record.get('savedNode'));
    })
}

const convertParametersToSET = (parameters) => {
    const arrayOfSets = [];
    for (let key in parameters) {
        if (key === 'fieldName') continue;
        const value = Array.isArray(parameters[key]) ? arrayToString(parameters[key]) : toString(parameters[key]);
        arrayOfSets.push(`policyItemSpec.${key} = ${value}`);
    }
    return arrayOfSets
}

const arrayToString = (arr) => {
    const strigifiedArray = arr.map(item => {
        return toString(item)
    }).join(',');
    return `[${strigifiedArray}]`;
}

const toString = (field) => {
    return `'${field}'`
}

const createRelationBetween = async (childField, parentFieldName) => {
    const client = getInstance();
    const dbSession = client.session({
        database: 'neo4j',
        defaultAccessMode: session.WRITE
    })

    const query =
        `MATCH
    (childField: PolicyItemSpec { fieldName: $childFieldName}),
    (parentField: PolicyItemSpec { fieldName: $parentFieldName})
    MERGE (childField)-[r:DEPENDS_ON]->(parentField)
    RETURN type(r)`;

    return dbSession.writeTransaction(async (tx) => {
        const result = await tx.run(query, {
            childFieldName: childField['fieldName'],
            parentFieldName
        })
        return result;
    })

}

const startProcess = ({ processType, projectName }) => {
    const client = getInstance();
    const dbSession = client.session({
        database: 'neo4j',
        defaultAccessMode: session.WRITE
    })
    const query = `
    MERGE (rootB:ProcessInstance{type:'${processType}', project: '${projectName}'})
    ON CREATE SET
    rootB.createdOn = timestamp()
    WITH rootB
    MATCH  (rootA:ProcessDefinition{type:'${processType}'})
    CALL apoc.path.subgraphAll(rootA, {relationshipFilter:'PART_OF'})
    YIELD nodes, relationships
    CALL apoc.refactor.cloneSubgraph(
    nodes,
    [rel in relationships],
    { standinNodes:[[rootA, rootB]] })
    YIELD input, output, error
    REMOVE output:PolicyItemSpec
    SET 
        output:PolicyItem,
        output.createdOn = timestamp()
    RETURN input, output, error`

    return dbSession.writeTransaction(async (tx) => {
        const result = await tx.run(query)
        return result;
    })
}

const getAnswerableItemsForProcess = ({ projectName, processType }) => {
    const processInstanceArgs = `{project: '${projectName}', type: '${processType}'}`
    const query = `
        MATCH (p:ProcessInstance ${processInstanceArgs})-[r:PART_OF]-(child:PolicyItem)-[:DEPENDS_ON]->(parent:PolicyItem)
        WHERE parent.value IS null WITH collect(child) as unanswerables
        MATCH (p:ProcessInstance ${processInstanceArgs})-[r:PART_OF]-(these:PolicyItem) 
        WHERE NOT (these) IN (unanswerables)
        RETURN these
    `;
    return runQuery({ query }).then(result => {
        return result.records.map(record => record.get('these'));
    });
}

const runQuery = async ({ query, args = {}}) => {
    const client = getInstance();
    const dbSession = client.session({
        database: 'neo4j',
        defaultAccessMode: session.WRITE
    })
    return dbSession.writeTransaction(async (tx) => {
        const result = await tx.run(query, args)
        return result;
    })
}

const dataService = {
    save,
    saveWithRelations,
    closeConnection,
    startProcess,
    getAnswerableItemsForProcess
}
export default dataService

export {
    save,
    saveWithRelations,
    closeConnection,
    startProcess,
    getAnswerableItemsForProcess
}