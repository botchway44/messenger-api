import { v4 as uuidv4 } from 'uuid';


export type TaskState = 'NEW' | 'PENDING' | 'COMPLETED';

export interface ITask {
    id: string,
    name: string
    description?: string
    status?: TaskState
    due: string
    time: string
}

export class NewTask implements ITask {
    constructor(public name: string, public due: string, public time: string) {
        const uuid = uuidv4();
        this.id = uuid;

        // set status as new
        this.status = 'NEW';
    }

    public status: TaskState;
    public id: string
}

