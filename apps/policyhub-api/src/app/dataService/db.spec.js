/* eslint-disable no-undef */
import { save, saveWithRelations, closeConnection, startProcess, getAnswerableItemsForProcess } from "./db";


test('save free-nodes', async () => {
    const processType = 'ProcessX';
    const sampleNode = {fieldName: 'appName', enum: ['true', 'false'], title: 'Does the application expose web site(s) to the Internet?', type: 'string', enumNames: ['yes', 'no']}
    const result = await save({policyItemSpec: sampleNode, processType });
    // TODO: figure out why the above line doent return any value.. 
    // expect(result).toBeDefined(); 

})

test('save node with dependencies', async () => {
    const sampleSpecString = '["mockAppName",[{"fieldName":"product_code","processName":"Testform","title":"Product Code","type":"string","description":"stuff"},{"fieldName":"techs_used","processName":"Testform","items":{"enum":["js","react"],"title":"Select Tech","type":"string","enumNames":["Javascript","react"]},"title":"Application Technologies used","type":"array"}]]'
    const result = await saveWithRelations(JSON.parse(sampleSpecString));
})

test('instantiate a new process from ProcessDefinition', async () => {
    const x = await startProcess({ processType: 'Testform', projectName: 'Testing relabeling'})
})

test('should return all answerable items for a given process', async () => {
    const items = await getAnswerableItemsForProcess({ projectName: 'Testing relabeling', processType: 'Testform' })
    console.log(items.length);
})


afterAll(() => {
    closeConnection();
});