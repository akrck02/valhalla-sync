import Test from "../classes/Test";
import { TestState } from "../classes/TestState";
import TestSuite from "../classes/TestSuite";
import Logger from "../lib/Logger";
import NoteTests from "./NoteTests";
import StatusTests from "./StatusTests";
import SyncTests from "./SyncTests";
import TaskTests from "./TaskTests";
console.log = Logger.log;

const TEST_SUITES : any[] = [
    //StatusTests,
    SyncTests,
    TaskTests,
    NoteTests
];

async function start(){

    const start = new Date().getTime();
    const RUNNED_SUITES : TestSuite[] = [];
    let result : boolean  = true; 

    for (let i = 0; i < TEST_SUITES.length; i++) {
        const suiteType = TEST_SUITES[i];
        const suite = new suiteType();
        RUNNED_SUITES.push(suite);

        if(result) {
            result = await suite.runAll();
        } 
    }

    const end = new Date().getTime();

    Logger.hardTitle("TEST RESULTS")
    RUNNED_SUITES.forEach(suite => {
        Logger.jump();
        Logger.rawlog(suite.constructor.name.toUpperCase());
        Logger.line();
        Logger.jump();

        suite.getTests().forEach((test : Test) =>{
            if(test.getState() == TestState.PENDING){
                test.setState(TestState.SKIPPED);
            }

            switch (test.getState()) {
                case TestState.ERROR:
                    Logger.error(test.getName() + " : " + test.getStateName());
                    break;
                case TestState.FAILED:
                    Logger.warning(test.getName() + " : " + test.getStateName());
                    break;

                case TestState.PASSED:
                    Logger.success(test.getName() + " : " + test.getStateName());
                    break;
                default:
                    Logger.log(test.getName() + " : " + test.getStateName())
                    break;
            }

          
        })
    })
    
    Logger.jump();
    Logger.line();
    Logger.log("TOTAL TIME: " + (end-start) + "ms.\n");
}

start();