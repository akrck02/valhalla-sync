import Test from "../classes/Test";
import TestSuite from "../classes/TestSuite";
import Logger from "../lib/Logger";
import fetch from "node-fetch";
import Assertion from "../lib/Assertion";
import ITask from "../../db/core/interface/ITask";

export default class SyncTests extends TestSuite {
    tests = [
        new Test(async function exportTasksTest(){
            const url = "http://127.0.0.1:5500/sync/v1/export";
            const response = await fetch(url, {
                method: 'post',
                body: JSON.stringify({
                    user : "test"   
                }),
                headers: {'Content-Type': 'application/json'}
            });

            const body = await response.json();

            Logger.log("URL:      " + url)
            Logger.log("Status:   " + body.code)
            Logger.log("Success:  " + (body.success || body.code == 200))

            Assertion.assert(body,"Cannot ping the sync API")
            Assertion.assert(body.success || body.code == 200 ,"The sync API send an error [" + body.code + "] " + body.reason)


            const tasks : any[] = body.tasks;

            const task1 = {
                id: 1,
                author : "default",
                name : "Task 1",
                description : "Generic description",
                start : "2022-05-19",
                end : "2022-05-19",
                allDay : 0,
                done : 0,
                labels : ["Label"]
            }

            const task2 = {
                id: 2,
                author : "default",
                name : "Task 2",
                description : "generic description",
                start : "2022-05-19",
                end : "2022-05-19",
                allDay : 0,
                done : 0,
                labels : ["Label"]
            }

            const task3  = {
                id: 3,
                author : "default",
                name : "Task3",
                description : "Generic description",
                start : "2022-05-19",
                end : "2022-05-19",
                allDay : 0,
                done : 0,
                labels : ["Label2"]
            }
            
            Assertion.assert(tasks[0].id == task1.id, "[Task 1] id not matching");
            Assertion.assert(tasks[0].name == task1.name, "[Task 1] name not matching");
            Assertion.assert(tasks[0].description == task1.description, "[Task 1] description not matching");
            Assertion.assert(tasks[0].start == task1.start, "[Task 1] start date not matching");
            Assertion.assert(tasks[0].end == task1.end, "[Task 1] end date not matching");
            Assertion.assert(tasks[0].allDay == task1.allDay, "[Task 1] allDay not matching");
            Assertion.assert(tasks[0].done == task1.done, "[Task 1] done not matching");
            Assertion.assert(tasks[0].labels.join("") == task1.labels.join(""), "[Task 1] labels not matching");

            Assertion.assert(tasks[1].id == task2.id, "[Task 2] id not matching");
            Assertion.assert(tasks[1].name == task2.name, "[Task 2] name not matching");
            Assertion.assert(tasks[1].description == task2.description, "[Task 2] description not matching");
            Assertion.assert(tasks[1].start == task2.start, "[Task 2] start date not matching");
            Assertion.assert(tasks[1].end == task2.end, "[Task 2] end date not matching");
            Assertion.assert(tasks[1].allDay == task2.allDay, "[Task 2] allDay not matching");
            Assertion.assert(tasks[1].done == task2.done, "[Task 2] done not matching");
            Assertion.assert(tasks[1].labels.join("") == task2.labels.join(""), "[Task 2] labels not matching");

            Assertion.assert(tasks[2].id == task3.id, "[Task 3] id not matching");
            Assertion.assert(tasks[2].name == task3.name, "[Task 3] name not matching");
            Assertion.assert(tasks[2].description == task3.description, "[Task 3] description not matching");
            Assertion.assert(tasks[2].start == task3.start, "[Task 3] start date not matching");
            Assertion.assert(tasks[2].end == task3.end, "[Task 3] end date not matching");
            Assertion.assert(tasks[2].allDay == task3.allDay, "[Task 3] allDay not matching");
            Assertion.assert(tasks[2].done == task3.done, "[Task 3] done not matching");
            Assertion.assert(tasks[2].labels.join("") == task3.labels.join(""), "[Task 3] labels not matching");

            
        })
    ]



    async runAll(){
        await TestSuite.runAll(this.constructor.name,this.tests)
    }
}