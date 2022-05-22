import { BackupHandler } from "../../db/backup/backup";
import INote from "../../db/core/interface/INote";
import Test from "../classes/Test";
import TestSuite from "../classes/TestSuite";
import Assertion from "../lib/Assertion";
import Logger from "../lib/Logger";

export default class NoteTests extends TestSuite {
    tests = [
        new Test(async function exportNotesTest(){

            const body = await BackupHandler.export("test");

            Logger.log("Function: " + "Export")
            Logger.log("Status:   " + body.code)
            Logger.log("Success:  " + (body.success || body.code == 200))

            Assertion.assert(body,"Cannot ping the sync API")
            Assertion.assert(body.success || body.code == 200 ,"The sync API send an error [" + body.code + "] " + body.message)

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