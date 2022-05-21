import { Database } from "sqlite";
import { SuccessType, SUCCESS_FALSE, SUCCESS_TRUE } from "../api/Actions";
import ITask from "../interface/ITask";
import { LabelData } from "./LabelData";

export class TaskData {

    /**
     * 
     * @param db The databas3e connection
     * @param username The user who owns the tasks
     * @returns The query result
     */
     public static getUserTasks(db: Database, username: string): Promise<any> {
        const SQL = "SELECT * FROM task WHERE author = ? ORDER BY end DESC";
        const response = db.all(SQL,username);
        return response;
    }
 
    /**
     * Insert a task for a given user 
     * @param db The databse connection
     * @param task The task to be inserted
     */
    public static async insertUserTask(db : Database, task : ITask) : Promise<SuccessType> {

        const SQL = "INSERT INTO task(author, name, description, start, end, allDay, done) VALUES (?,?,?,?,?,?,?)";
        const response = await db.run(SQL,
            task.author,
            task.name,
            task.description,
            task.start,
            task.end,
            task.allDay,
            task.done
        )

        if(!response) 
            return SUCCESS_FALSE;

        if(response.changes == 0) 
            return SUCCESS_FALSE;

        task.labels?.forEach(tag => LabelData.setLabelToTask(db, response.lastID + "", tag));
        
        return SUCCESS_TRUE;
    }
}