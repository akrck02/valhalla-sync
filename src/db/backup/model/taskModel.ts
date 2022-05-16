import { Database } from "sqlite";

export default class TaskModel {

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
     * Get the week tasks for a given user
     * @param db The database connection
     * @param id The task id to search for
     * @returns The query result
     */
    public static async getUserTaskLabels(db: Database, id: string): Promise<any> {
        const SQL = "SELECT label FROM task_label WHERE taskId = ? ORDER BY label";
        const response = await db.all(SQL,id);

        const labels = [];

        for (const index in response) {
          labels.push(response[index].label)
        }

        return new Promise((r) => r(labels));
    }
    

}