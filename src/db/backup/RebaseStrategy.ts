import DateUtils from "../utils/DateUtils";
import SyncStrategy from "./SyncStrategy";

export default class RebaseStrategy extends SyncStrategy {
    
    public async apply(data : any, data2 : any) : Promise<any> {

        // Send last data
        data.lastSync = DateUtils.toSQLiteDate(new Date())
        return data;

    }

}