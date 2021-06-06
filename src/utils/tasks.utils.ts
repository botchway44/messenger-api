import { ITask, NewTask } from "../dto";


export const CreateNewTask = (name: string, description: string, dueDate: string, email: string): NewTask => new NewTask(name, dueDate, description, email);


export const filter = (name: string, tasks: ITask[]): ITask[] => tasks.filter(task => task.name.includes(name))