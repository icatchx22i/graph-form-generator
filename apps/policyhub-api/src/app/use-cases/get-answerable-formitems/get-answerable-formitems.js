// get all answerable items
// compile their JSON into one 
// return renderable schema..

export default function makeGetAnswerableFormItems({ dataService }) {
    return {
        getFormSchemaForProjectByProcess: ({ project, processtype }) => {
            const answerablePolicyItems = await dataService.getAnswerableItemsForProcess({ project, processtype });
            const justProperties = answerablePolicyItems.map(item => item.properties);
            return {
                type: 'object',
                properties: justProperties,
                title: processtype
              }
        }
    }
}