export default function makeInstantiateProcess({ dataService }) {
    return function ({ projectName, processName }) {

        // What else do we need to know about new processes?
        dataService.startNewProcess({ projectName, processName });
    }
}