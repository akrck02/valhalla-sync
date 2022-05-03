import { Database } from "../db"

export class UserDb extends Database {

    constructor(name : string) {
        super(name + "-user");
        this.open().then(() => this.createTables())
    }

    async createTables() {
        const fs = require('fs');
        const query = fs.readFileSync('res/user-db.sql', 'utf8');
        await this.db.exec(query);
    }
}