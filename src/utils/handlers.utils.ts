import { conversation, ConversationV3, Image, Simple, Suggestion } from '@assistant/conversation';
import { Session } from '@assistant/conversation/dist/conversation/handler';
import { CreateNewTask } from './tasks.utils';
import { decodeUser } from './user.utils';

export function handleAddTasks(conv: ConversationV3) {
    const authHeader = conv.headers.authorization?.toString() || "";
    // const user = conv.user.processAuthHeader(authHeader, new AuthHeaderProcessor())


    // destruct task details
    const name = conv.session.params?.name;
    const description = conv.session.params?.name;
    const due = conv.session.params?.name;

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
        
        // send prompt message 
        conv.add(
            new Simple(`Okay ${user.family_name}, your task is created`)
        );
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

}

export function handleAllTasks(conv: ConversationV3) {

}