import { Request, Response } from "express";
import { MISSING_PARAMETERS, NOT_IMPLEMENTED_YET } from "../../core/responses";
import { UserDb } from "../userDb";



interface UserData {
    name : string
    oauth :string
    email : string
    picture : string
}

export class BackupHandler {

    public export(req : Request, res : Response) : Promise<any> {
        return new Promise(r => r(NOT_IMPLEMENTED_YET))
    }

    public import(req : Request, res : Response) : Promise<any> {

        const data = req?.body?.data;

        if(!data) {
            return MISSING_PARAMETERS;
        }

        this.importUser(data.user);
        this.importTasks();
        this.importNotes();
        this.importConfig();

        return new Promise(r => r(NOT_IMPLEMENTED_YET));
    }

    private async importUser(user : UserData) : Promise<any> {
        if(!user.name || !user.email || !user.oauth){
            return MISSING_PARAMETERS
        }

    }

    private importTasks() {

    }

    private importNotes() {

    }

    private importConfig() {

    } 

}
