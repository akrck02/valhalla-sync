import { AuthDb } from "../../db/core/classes/AuthDb";
import { UserDb } from "../../db/core/classes/UserDb";
import Paths from "../../db/core/config/Paths";
import PreloadScript from "../classes/PreloadScript";
import Logger from "../lib/Logger";

export class PreloadTestDatabases extends PreloadScript {
    

    public async execute() : Promise<any> {

        const fs = require('fs');

        Logger.log("Creating test auth database...");
        const testAuthDb = new AuthDb("test");
        await testAuthDb.open();
        await testAuthDb.createTables();

        const query = fs.readFileSync(Paths.TEST_PREPARE_AUTH_DB, 'utf8');
        await testAuthDb.get().exec(query);
        await testAuthDb.close();
        Logger.success("Done.");
        
        Logger.log("Creating test user database...")
        const testUserDb = new UserDb("test");
        await testUserDb.open();
        await testUserDb.createTables();

     
        const query2 = fs.readFileSync(Paths.TEST_PREPARE_USER_DB, 'utf8');
        await testUserDb.get().exec(query2);

        await testUserDb.close();
        Logger.success("Done.");
        

    }
}