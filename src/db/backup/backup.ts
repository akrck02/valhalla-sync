import { Request, Response } from "express";
import { MISSING_PARAMETERS, NOT_IMPLEMENTED_YET } from "../core/api/Responses";
import { UserDb } from "../core/classes/UserDb";
import { LabelData } from "../core/data/LabelData";
import { NoteData } from "../core/data/NoteData";
import { TaskData } from "../core/data/TaskData";
import INote from "../core/interface/INote";


export class BackupHandler {

    private static DEFAULT_USER: string = "default";

    public static async import(req: Request, res: Response): Promise<any> {

        const user = req?.body?.user;
        if (!user) {
            return MISSING_PARAMETERS;
        }

        const db = new UserDb(user);
        await db.open();

        return new Promise(r => r(NOT_IMPLEMENTED_YET))
    }

    public static async export(req: Request, res: Response): Promise<any> {

        const user = req?.body?.auth;
        if (!user) {
            return MISSING_PARAMETERS;
        }

        const db = new UserDb(user);
        await db.open();

        const tasks = await this.exportTasks(db, this.DEFAULT_USER);
        const notes = await this.exportNotes(db, this.DEFAULT_USER);
        this.exportConfig();

        return new Promise(r => r({
            code: 200,
            tasks: tasks,
            notes: notes
        }));
    }

    private static async exportTasks(db: UserDb, user: string) {

        const tasks = await TaskData.getUserTasks(db.get(), user);

        for (const index in tasks) {
            const task = tasks[index];
            tasks[index].labels = await LabelData.getUserTaskLabels(db.get(), task.id);
        }

        return tasks
    }

    private static async exportNotes(db: UserDb, user: string): Promise<INote[]> {
        return await NoteData.getuserNotes(db.get(), user);
    }

    private static exportConfig() {

    }

}
