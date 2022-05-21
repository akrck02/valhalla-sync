import { Database } from "../db"

export class AuthDb extends Database {

    constructor() {
        super("auth");
        this.open().then(() => this.createTables())
    }

    async createTables() {
        const fs = require('fs');
        const query = fs.readFileSync('res/auth.sql', 'utf8');
        await this.db.exec(query);
    } 
}