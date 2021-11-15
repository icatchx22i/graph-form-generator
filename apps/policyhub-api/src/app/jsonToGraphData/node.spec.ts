/* eslint-disable no-undef */
import { makeNode } from "./node";
import testSchema from "./fixtures/sampleSchema";

test('should accept json and return an array of commands', () => {
    const testfieldName = 'ispublic';
    const justProperties = { title: testSchema.title, properties: testSchema.properties };
    const node = makeNode({ name: testfieldName, specs: justProperties});
    expect(node).toBeDefined();
    // expect(node.length).toBe(3);
})


