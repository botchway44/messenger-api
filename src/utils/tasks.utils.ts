import { ITask, NewTask } from "../dto";


export const CreateNewTask = (name: string, dueDate: string, time: string): NewTask => new NewTask(name, dueDate, time);


export const filter = (name: string, tasks: ITask[]): ITask[] => tasks.filter(task => task.name.includes(name))