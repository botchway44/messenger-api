// Import the appropriate service and chosen wrappers
import { conversation, Image } from '@assistant/conversation';
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

// Create an app instance
const app = conversation();



// Register handlers for Actions SDK
const expressApp = express().use(bodyParser.json());

// ... app code here
// app.handle('AddTaskIntent', conv => {
//     conv.add('Hi, how is it going?');
//     conv.add(new Image({
//         url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
//         alt: 'A cat',
//     }));
// });


// Place scenename here
app.handle('start_scene_initial_prompt', (conv) => {
    console.log('Start scene: initial prompt');
    conv.overwrite = false;
    // conv.scene.next = { name: 'actions.scene.END_CONVERSATION' };
    conv.add('Hello world from fulfillment handler');

    console.log(conv);
});

// use intent handler name here
app.handle('AddTaskIntent', (conv) => {
    console.log('Add tasks scene:  prompt');
    conv.overwrite = false;

    // conv.scene.next = { name: 'actions.scene.END_CONVERSATION' };
    conv.add('Hello world from Add tasks');
    conv.add(new Image({
        url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
        alt: 'A cat',
    }));
    console.log(conv);

    conv
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
    console.log("App is running on port " + PORT);
});