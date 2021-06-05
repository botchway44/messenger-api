import { Collection } from "mongodb";
import { ITask } from "src/dto";

const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
require("dotenv").config();

/**
 * A thin MongoClientConnection Wrapper
 * Todo : Make class generic, separate mongo specific from repository specific operations
 */
export class MongoClientConnection {
    public tasks_db_name = 'tasks';
    tasks_collection: any;
    mongo_url = process.env.MONGODB_URL;

    db_name = 'LexVoiceApp';

    constructor() {
    }

    connect() {

        console.log(this.mongo_url)
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.mongo_url, { useUnifiedTopology: true }, async (
                err: any,
                client: any
            ) => {
                // throw error
                if (err) { reject(err); throw err; };

                // log connected
                console.log('connected to database');
                this.tasks_collection = await client.db(this.db_name).collection(this.tasks_db_name);

                resolve(true)
            });
        });



    }

    async addTask(task: ITask) {
        return await this.tasks_collection.insertOne(task);
    }


    async removeTask(task: ITask) {
        return await this.tasks_collection.deleteOne({ id: task.id });
    }

    async updateTask(task: ITask) {
        return await this.tasks_collection.updateOne({ id: task.id }, task);
    }

    getAllTasks() {
        return this.tasks_collection.find().toArray();
    }

    find(task: ITask) {
        return this.tasks_collection.find().toArray();
    }

    getTask(id: string) {
        return this.tasks_collection.findOne({ _id: ObjectID(id) });
    }


    async removeAllTasks() {
        return await this.tasks_collection.deleteMany({});
    }



}