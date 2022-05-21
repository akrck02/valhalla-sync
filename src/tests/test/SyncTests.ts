import Test from "../classes/Test";
import TestSuite from "../classes/TestSuite";
import Logger from "../lib/Logger";
import fetch from "node-fetch";
import Assertion from "../lib/Assertion";
import ITask from "../../db/core/interface/ITask";
import { Router } from "../../db/router";
import { request, response } from "express";

export default class SyncTests extends TestSuite {
    tests = [
        new Test(async function syncTest() {
        })
    ]
    
    async runAll(){
        return await super.runAll(this.constructor.name)
    }
}