import { Request, Response } from "express";
import Logger from "../../tests/lib/Logger";
import { AuthHandler } from "../auth/auth";
import { ALREADY_SYNC, INCORRECT_CREDENTIALS, MISSING_PARAMETERS, NOT_IMPLEMENTED_YET } from "../core/api/Responses";
import { UserDb } from "../core/classes/UserDb";
import { LabelData } from "../core/data/LabelData";
import { NoteData } from "../core/data/NoteData";
import { TaskData } from "../core/data/TaskData";
import INote from "../core/interface/INote";
import DateUtils from "../utils/DateUtils";
import RebaseStrategy from "./RebaseStrategy";


export class BackupHandler {

    private static DEFAULT_USER: string = "default";

    public static async sync(req: Request, res: Response, secret : string) {

        // Check auth token
        const token = req.header("auth");
        if(!token) {
            return INCORRECT_CREDENTIALS;
        }

        const tokenInfo = AuthHandler.getTokenInfo(token, secret);

        // Get request data
        const clientData = req.body.data;

        if(!clientData){
            return MISSING_PARAMETERS;
        }

        // If not exists
        if(!AuthHandler.isAuthenticated(token,secret)) {
            return INCORRECT_CREDENTIALS;
        }

        // Get last sync date (from db)
        const lastSyncDate = new Date();
        const clientSyncDate = new Date(clientData.lastSync);
        const serverData = await this.export(tokenInfo.username); 

        Logger.log(lastSyncDate.getTime())
        Logger.log(lastSyncDate)
        Logger.log(clientSyncDate.getTime())
        Logger.log(clientSyncDate)

        // If data outdated 

        const compareResult = DateUtils.compareBySecondConversion(lastSyncDate, clientSyncDate);

        if(compareResult == -1) {
            return await new RebaseStrategy().apply(serverData, clientData);;
        }
        
        // else if data is already sync
        if(BackupHandler.sameData(clientData, serverData)) {
            return ALREADY_SYNC;    
        }

        // else send server data
        await this.import(tokenInfo.username);
        return {
            success : true,
            date : DateUtils.toSQLiteDate(new Date())
        };

    }

    public static sameData(data:any , otherData:any) : boolean {
        return true;
    }


    public static async import(auth : string): Promise<any> {

        if (!auth) {
            return MISSING_PARAMETERS;
        }

        const db = new UserDb(auth);
        await db.open();

        // Check if tables exists

        // Che   

        return new Promise(r => r(NOT_IMPLEMENTED_YET))
    }

    public static async export(auth: string): Promise<any> {

        if (!auth) {
            return MISSING_PARAMETERS;
        }

        const db = new UserDb(auth);
        await db.open();

        const tasks = await this.exportTasks(db, this.DEFAULT_USER);
        const notes = await this.exportNotes(db, this.DEFAULT_USER);
        this.exportConfig();

        await db.close();

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
