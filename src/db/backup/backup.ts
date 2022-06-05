import { Request, Response } from "express";
import Logger from "../../tests/lib/Logger";
import { AuthHandler } from "../auth/auth";
import { ALREADY_SYNC, INCORRECT_CREDENTIALS, MISSING_PARAMETERS, NOT_IMPLEMENTED_YET } from "../core/api/Responses";
import { UserDb } from "../core/classes/UserDb";
import { LabelData } from "../core/data/LabelData";
import { NoteData } from "../core/data/NoteData";
import { TaskData } from "../core/data/TaskData";
import INote, { INoteComparer } from "../core/interface/INote";
import { ITaskComparer } from "../core/interface/ITask";
import { Compare } from "../core/utils/Compare";
import DateUtils from "../core/utils/DateUtils";
import RebaseStrategy from "./RebaseStrategy";


export class BackupHandler {

    private static DEFAULT_USER: string = "default";

    /**
     * Sync the data between devices 
     * @param req The HTTP request
     * @param res The HTTP response
     * @param secret The Secret key
     * @returns The state of the sync and if outdated, the data
     */
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

        // If data outdated 
        const result = DateUtils.compareBySecondConversion(lastSyncDate, clientSyncDate);

        if(result == Compare.GREATER) {
            return await new RebaseStrategy().apply(serverData, clientData);;
        }
       
        // else if data is already sync
        if(BackupHandler.sameData(clientData, serverData)) {
            return ALREADY_SYNC;    
        }

        // else import client data
        await this.import(tokenInfo.username);
        return new Promise((r) => r({
            success : true,
            code : 200,
            lastSync : DateUtils.toSQLiteDate(new Date())
        }));

    }

    /**
     * Compare data between two backup objects
     * @param data The data to compare
     * @param otherData The data to compare with
     * @returns true or false
     */
    public static sameData(data:any , otherData:any) : boolean {

        if(!data || !otherData) {
            return false;
        }

        // Compare tasks
        if(!data.tasks || !otherData.tasks || data.tasks.length != otherData.tasks.length) {
            return false;
        }   

        for(const index in data.tasks) {
            const task = data.tasks[index];
            const otherTask = otherData.tasks[index];

            if(!ITaskComparer.equals(task, otherTask)) {
                return false;
            }
        }

        // Compare notes
        if(data.notes.length != otherData.notes.length) {
            return false;
        }

        for(const index in data.notes) {
            const note = data.notes[index];
            const otherNote = otherData.notes[index];

            if(!INoteComparer.equals(note, otherNote)) {
                return false;
            }
        }

        return true;
    }

    /**
     * 
     */
    public static async import(auth : string): Promise<any> {

        if (!auth) {
            return MISSING_PARAMETERS;
        }

        //const db = new UserDb(auth);
        //await db.open();

        // Check if tables exists

        // Che   

        return new Promise(r => r(NOT_IMPLEMENTED_YET))
    }

    /**
     * Export the auth database into a object
     * @param auth The auth to check for
     * @returns The database exported into an object
     */
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

    /**
     * Export the tasks of a given user db into and object
     * @param db The user db connection
     * @param user The usern name
     * @returns The user tasks in an object
     */
    private static async exportTasks(db: UserDb, user: string) {

        const tasks = await TaskData.getUserTasks(db.get(), user);

        for (const index in tasks) {
            const task = tasks[index];
            tasks[index].labels = await LabelData.getUserTaskLabels(db.get(), task.id);
        }

        return tasks
    }

    /**
     * Export the notes for a given user db into an object
     * @param db The user db connection
     * @param user The user name
     * @returns The user notes in an INote list
     */
    private static async exportNotes(db: UserDb, user: string): Promise<INote[]> {
        return await NoteData.getuserNotes(db.get(), user);
    }

    private static exportConfig() {

    }

}
