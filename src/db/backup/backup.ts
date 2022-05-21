import { Request, Response } from "express";
import { MISSING_PARAMETERS, NOT_IMPLEMENTED_YET } from "../core/api/Responses";
import { LabelData } from "../core/data/LabelData";
import { TaskData } from "../core/data/TaskData";
import { UserDb } from "../core/classes/UserDb";
import { NoteData } from "../core/data/NoteData";
import INote from "../core/interface/INote";



interface UserData {
    name : string
    oauth :string
    email : string
    picture : string
}

export class BackupHandler {

    private static DEFAULT_USER : string = "default";

    public static import (req : Request, res : Response) : Promise<any> {
        return new Promise(r => r(NOT_IMPLEMENTED_YET))
    }

    public static async export(req : Request, res : Response) : Promise<any> {

        /*
        const data = req?.body?.data;

        if(!data) {
            return MISSING_PARAMETERS;
        }
        */

        const user = req?.body?.user;
        if(!user) {
            return MISSING_PARAMETERS;
        }

        const db = new UserDb(user);
        await db.open();

        this.exportUser(user);
        const tasks = await this.exportTasks(db, this.DEFAULT_USER);
        const notes = await this.exportNotes(db, this.DEFAULT_USER);
        this.exportConfig();

        return new Promise(r => r({
            code : 200,
            tasks: tasks,
            notes: notes
        }));
    }

    private static async exportUser(user : UserData) : Promise<any> {
        if(!user.name || !user.email || !user.oauth) {
            return MISSING_PARAMETERS
        }
    }

    private static async exportTasks(db : UserDb, user : string) {
        
        const tasks = await TaskData.getUserTasks(db.get(),user); 
            
        for (const index in tasks) {
            const task = tasks[index];
            tasks[index].labels = await LabelData.getUserTaskLabels(db.get(), task.id);
        }

        return tasks
    }

    private static async exportNotes(db : UserDb, user : string) : Promise<INote[]>{

        const notes = await NoteData.getuserNotes(db.get(),user);


        return notes;
    }

    private static exportConfig() {

    } 

}
