
export class AuthTableSet {

    static async createTables(db : any) {
        await this.createUserTable(db);
    }


    static async createUserTable(db : any) {
        const fs = require('fs');
        const query = fs.readFileSync('res/auth.sql', 'utf8');
        await db.exec(query);
    }
}