import { Database } from "sqlite";
import { SUCCESS_FALSE, SUCCESS_TRUE } from "../api/Actions";
import INote from "../interface/INote";

export class NoteData {

    /**
     * Get the notes of a user
     * @param db The database connection
     * @param username The username to search for
     * @returns The notes of a given user
     */
     public static async getuserNotes(db: Database, username : string ) {
        const SQL = "SELECT * FROM note WHERE author = ?";
        const response = await db.all(SQL, username);
        return response;
    }

    /**
     * Insert a user note
     * @param db The database connection
     * @param note The note to insert
     * @returns If the note was inserted
     */
     public static async insertUserNote(db: Database, note : INote): Promise<any> {

        const SQL = "INSERT INTO note (author, title, content) VALUES(?,?,?)";

        const response = await db.run(SQL,
            note.author,
            note.title,
            note.content,
        )

        if(!response) 
            return SUCCESS_FALSE;

        if(response.changes == 0) 
            return SUCCESS_FALSE;

        return SUCCESS_TRUE;

    }


}