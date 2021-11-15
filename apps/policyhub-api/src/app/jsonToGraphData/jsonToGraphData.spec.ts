/* eslint-disable no-undef */
import { makeJsonToGraphDataService } from "./jsonToGraphData";
import testSchema from "./fixtures/sampleSchema";

import dataService from "../dataService/db";


test('stuff', async () => {
    let calledDataService = false;
    const mockDataService = {
        save: (node) => {
            // console.log(node);
            calledDataService = true;
            return 1;
        },
        saveWithRelations: async (stuff) => {
            return 1;
        }
    }
    const service = makeJsonToGraphDataService({ dataService: mockDataService});
    const result = await service.jsonToGraph(testSchema); 
    expect(calledDataService).toBe(true);
})

/// need to run the below twice ot actually get the relationships!!!
test('int - test saving a schema', async () => {
    const service = makeJsonToGraphDataService({ dataService });
    await service.jsonToGraph(testSchema);

})

afterAll(() => {
    dataService.closeConnection();
});