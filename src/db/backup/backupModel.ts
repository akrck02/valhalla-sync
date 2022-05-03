import { UserDb } from "./userDb";

export class BackupModel {

    db : UserDb;
    secret : string;
    
    constructor(secret : string = "***", name : string) {
        this.db = new UserDb(name);
        this.secret = secret;
    }

}