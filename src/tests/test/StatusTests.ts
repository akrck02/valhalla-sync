import Test from "../classes/Test";
import TestSuite from "../classes/TestSuite";
import Assertion from "../lib/Assertion";
import Logger from "../lib/Logger";
import fetch from "node-fetch";

export default class StatusTests extends TestSuite {
    tests = [

        /**
         * Ping the API to know if active
         */
        new Test(async function pingTest(){

            const url = "http://127.0.0.1:5500/sync/v1/ping";
            const response = await fetch(url);
            const body = await response.json();

            Logger.log("URL:      " + url)
            Logger.log("Status:   " + body.code)
            Logger.log("Success:  " + body.success)
            Logger.log("Response: " + body.message)

            Assertion.assert(body,"Cannot ping the sync API")
            Assertion.assert(body.success ,"The sync API send an error [" + body.code + "] " + body.message)
            
            Logger.jump();
        }),

    ];

    async runAll(){
        return await super.runAll(this.constructor.name)
    }
}