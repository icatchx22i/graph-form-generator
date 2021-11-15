export function makeNode ({ name, specs }) {
    // const nodes = Object.keys(specs.properties).map(spec => {
    //     return {
    //         processName: specs.title,
    //         ...specs.properties[spec],
    //     }
    // })
    // return nodes;
    return {
        fieldName: name,
        processName: specs.title,
        ...specs.properties[name],
    }
}
