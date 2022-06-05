import { Database } from "sqlite";
import { IUser } from "../interface/IUser";

export class UserData {

    public static async getUserInfoByName(db: Database, username : string ) : Promise<IUser> {

        const SQL = "SELECT * FROM user";
        const response = await db.all(SQL);
        return response[0];

    }
}