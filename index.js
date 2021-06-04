// Import the appropriate service and chosen wrappers
const {
    conversation,
    Image,
} = require('@assistant/conversation');

// Create an app instance
const app = conversation();

// Register handlers for Actions SDK

app.handle('AddTaskIntent', conv => {
    conv.add('Hi, how is it going?');
    conv.add(new Image({
        url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
        alt: 'A cat',
    }));
});
