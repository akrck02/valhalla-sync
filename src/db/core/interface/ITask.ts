import { Compare } from "../utils/Compare";

export default interface ITask {
    id: number;
    author: string;
    name: string;
    description?: string;
    start?: string;
    end?: string;
    allDay?: number;
    done?: number;
    labels?: string[];
}

export class ITaskComparer {
    public static equalsById(a: ITask, b: ITask): boolean {
        return a.id == b.id;
    }

    public static equals(a: ITask, b: ITask): boolean {

        if(!this.equalsById(a, b))
            return false;

        if(a.author != b.author)
            return false;

        if(a.name != b.name)
            return false;

        if(a.description != b.description)
            return false;

        if(a.start != b.start)
            return false;

        if(a.end != b.end)
            return false;

        if(a.allDay != b.allDay)
            return false;

        if(a.done != b.done)
            return false;

        // Compare labels
        if(a.labels?.length != b.labels?.length) {
            return false;
        }

        a.labels?.forEach(label => {
            if(!b.labels?.includes(label)) {
                return false;
            }
        });

        return true;
    }
}