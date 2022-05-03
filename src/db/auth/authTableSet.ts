
export class AuthTableSet {

    static async createTables(db : any) {
        await this.createUserTable(db);
    }


    static async createUserTable(db : any) {
        await db.exec(
            `CREATE TABLE IF NOT EXISTS user (
                token TEXT,
                username TEXT PRIMARY KEY,
                password TEXT,
                mail TEXT,
            )`
        ) 

    }
}