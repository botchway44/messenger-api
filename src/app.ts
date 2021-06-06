// Import the appropriate service and chosen wrappers
import { conversation, Image, List, Simple, Suggestion } from '@assistant/conversation';
import { AuthHeaderProcessor } from '@assistant/conversation/dist/auth';
import { decodeUser, handleAddTasks, MongoClientConnection } from './utils';
import { CreateNewTask } from './utils';

const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const fs = require('fs')

// Create an app instance
const app = conversation({
    debug: true,

});
let mongoClient: MongoClientConnection;


// Register handlers for Actions SDK
const expressApp = express().use(bodyParser.json());

// Place scenename here
app.handle('start_scene_initial_prompt', (conv) => {
    console.log('Start scene: initial prompt');
    conv.overwrite = false;
    // conv.scene.next = { name: 'actions.scene.END_CONVERSATION' };
    conv.add('Hello world from fulfillment handler');

});

// use intent handler name here
app.handle('all_tasks_scene', async (conv) => {

    console.log("all tasks scene, called")
    const authHeader = conv.headers.authorization?.toString() || "";

    const user = decodeUser(authHeader);

    // get all tasks and create a list
    const tasks = await mongoClient.getAllTasks((user?.email || ""));

    // if (tasks.length > 0) {

    //     // Create a list of tasks
    //     conv.add(new List())
    // }

    conv.add("Here is a list")

    conv.add(new List({
        title: 'Here is a list of items',
        subtitle: 'Below are the items list',
        items: [
            {
                key: 'List item 1'
            },
            {
                key: 'List item 2'
            },
            {
                key: 'list item 3'
            },
            {
                key: 'list item 4'
            }
        ],
    }));
});


// use intent handler name here
app.handle('AddTaskIntent', async (conv) => {
    const authHeader = conv.headers.authorization?.toString() || "";
    // const user = conv.user.processAuthHeader(authHeader, new AuthHeaderProcessor())

    // destruct task details
    const name = conv.session.params?.name;
    const description = conv.session.params?.description;
    const due = conv.session.params?.due;

    // If there is no name, call the same scene and ask for the name again
    // if (!name) {

    // }
    // conv.overwrite = true;
    // const session = conv.session.params || {};
    // session.name = null;
    // conv.session.params = session;
    const user = decodeUser(authHeader);

    if (!user) {
        conv.add(
            new Simple('In order for me to process your task, i need to link your account to google, Should i proceed?')
        );


        conv.add(new Suggestion({ title: 'Yes' }))
        conv.add(new Suggestion({ title: 'No' }))

    } else {
        // create task with user email
        const new_task = CreateNewTask(name, description, due, user.email)

        // insert into mongo
        await mongoClient.addTask(new_task).then(() => {
            conv.add(
                new Simple(`Okay ${user.family_name}, your task is created`)
            );
        });
        // send prompt message 

        // conv.scene.next = { name: 'AddTasks' };
    }
    // console.log(JSON.stringify(user))


    // conv.add(
    //     new Simple('Task create succesfully, i will send you email updates when the task is almost due')
    // );

    // conv.add(new Image({
    //     url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    //     alt: 'A cat',
    // }));

    // console.log(JSON.stringify(conv));

});


// Add a get Response for the assistant
expressApp.get('/', (req: any, res: any) => {
    res.status(200).json({ message: "This is the google assistant" });
});


// Post the fulfillment handler for the Google Assistant
expressApp.post('/fulfillment', app);


// Starting the App
const PORT = process.env.PORT || 3000;

expressApp.listen(PORT, () => {
    mongoClient = new MongoClientConnection();

    mongoClient.connect().then(() => {
        console.log("App is running on port " + PORT);
        console.log("Database is connected");

    })
});
