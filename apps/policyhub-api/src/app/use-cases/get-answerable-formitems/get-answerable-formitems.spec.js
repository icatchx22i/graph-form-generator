import makeGetAnswerableFormItems from "./get-answerable-formitems";

const dataService = {
    getAnswerableItemsForProcess: async (args) => {
        return Promise.resolve([{
            properties: {}
        }])
    }
}

test('should return json schema with answerable policy items in it', ()=> {
    const getAnswerableItemsForProcess = makeGetAnswerableFormItems({ dataService })
})