import { Collection } from "mongodb";
import { ITask } from "../dto";
import { IAccount } from "./account.dto";

const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
require("dotenv").config();

/**
 * A thin MongoClientConnection Wrapper
 * Todo : Make class generic, separate mongo specific from repository specific operations
 */
export class MongoClientConnection {
    public tasks_db_name = 'accounts';
    accounts_collection: any;
    mongo_url = process.env.MONGODB_URL;

    db_name = 'LexVoiceApp';

    constructor() {
    }

    connect() {

        console.log("Connecting to Databse ... ")
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.mongo_url, { useUnifiedTopology: true }, async (
                err: any,
                client: any
            ) => {
                // throw error
                if (err) { reject(err); throw err; };

                // log connected
                console.log('connected to database');
                this.accounts_collection = await client.db(this.db_name).collection(this.tasks_db_name);

                resolve(true)
            });
        });



    }

    async addTask(account: IAccount) {
        return await this.accounts_collection.insertOne(account);
    }


    getAllTasks(email: string) {
        return this.accounts_collection.find({ email: email }).toArray();
    }

    find(email: string) {
        return this.accounts_collection.find().toArray();
    }


    getAccount(email: string) {
        return this.accounts_collection.findOne({ email: email });
    }





}