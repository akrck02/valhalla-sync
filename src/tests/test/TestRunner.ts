import TestSuite from "../classes/TestSuite";
import Logger from "../lib/Logger";
import StatusTests from "./StatusTests";
import SyncTests from "./SyncTests";
console.log = Logger.log;

const TEST_SUITES : any[] = [
   // StatusTests,
    SyncTests
];

let i = 0;
TEST_SUITES.forEach(async testSuite => {
    const suite = new testSuite();
    await suite.runAll();
});