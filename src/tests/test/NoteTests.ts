import Test from "../classes/Test";
import TestSuite from "../classes/TestSuite";
import Logger from "../lib/Logger";
import fetch from "node-fetch";
import Assertion from "../lib/Assertion";
import ITask from "../../db/core/interface/ITask";
import { Router } from "../../db/router";
import { request, response } from "express";
import INote from "../../db/core/interface/INote";

export default class NoteTests extends TestSuite {
    tests = [
        new Test(async function exportTasksTest(){
            const router = new Router("UNLIMITED_POWER")

            request.body = {
                user : "test"
            }

            const body = await router.PATHS.export(request,response);

            Logger.log("Function: " + "Export")
            Logger.log("Status:   " + body.code)
            Logger.log("Success:  " + (body.success || body.code == 200))

            Assertion.assert(body,"Cannot ping the sync API")
            Assertion.assert(body.success || body.code == 200 ,"The sync API send an error [" + body.code + "] " + body.reason)

            const notes : INote[] = body.notes;
            const note1 = {
                id: 1,
                author : "default",
                title : "Note 1",
                content : "Hello World!",
            }

            Assertion.assert(notes[0].id == note1.id,"Id not matching")
            Assertion.assert(notes[0].title == note1.title,"Title not matching")
            Assertion.assert(notes[0].content == note1.content,"Content not matching")
            Assertion.assert(notes[0].author == note1.author,"Author not matching")
            
        })
    ]



    async runAll(){
        return await super.runAll(this.constructor.name)
    }
}