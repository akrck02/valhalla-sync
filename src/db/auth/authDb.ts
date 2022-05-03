import { Database } from "../db"
import { AuthTableSet } from "./authTableSet";

export class AuthDb extends Database {

    constructor() {
        super("auth");
        this.open().then(() =>
        this.createTables()

        )
    }

    async createTables() {
        AuthTableSet.createTables(this.db);
    }
}