import { Database } from "../db"

export class UserDb extends Database {

    constructor(name : string) {
        console.log("UserDB", "Opening database for user " + name)
        super(name + "-user");
    }

    async createTables() {
        const fs = require('fs');
        const query = fs.readFileSync('res/user-db.sql', 'utf8');
        await this.db.exec(query);
    }
}