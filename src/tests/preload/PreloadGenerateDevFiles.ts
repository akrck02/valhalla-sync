import { request, response } from "express";
import { BackupHandler } from "../../db/backup/backup";
import DateUtils from "../../db/core/utils/DateUtils";
import { Router } from "../../db/router";
import PreloadScript from "../classes/PreloadScript";
import Logger from "../lib/Logger";
import SyncTests from "../test/SyncTests";

export class PreloadGenerateDevFiles extends PreloadScript {
    

    public async execute() : Promise<any> {

        const fs = require('fs');
        Logger.log("Exporting JSON...");

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJwYXNzd29yZCI6InRlc3QiLCJtYWlsIjoidGVzdC51c2VyQHRlc3QudXNlciIsImRldmljZSI6IjAuMC4wLjAiLCJpYXQiOjE2NTQ0NDgwOTB9.tju_jyPEc9HkzGyz7hWx9PIB55Wi0tAVptLyeX1BriQ";
        request.headers["auth"] = token;

        request.body = {
            auth: "test",
            data:{
                lastSync: "1970-01-01 00:00:00"
            }
            
        }

        const data = await BackupHandler.sync(request,response,"***");
        fs.writeFileSync("./res/test.json", JSON.stringify(data, null, 4));
        
        Logger.success("Done.");      

    }
}