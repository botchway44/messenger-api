import { ResponseContentType } from ".";

export interface IMessage {
    contentType?: ResponseContentType,
    content: string
}

export class Message implements IMessage {
    constructor(public content: string, public contentType?: ResponseContentType) {
        if (!this.contentType) {
            this.contentType = "PlainText";
        }
    }
}


export class MessageBuilder {

    // Todo Fix to take multiple messages and push
    constructor(messages: string[]) {

        for (const message of messages) {
            const newMessage = new Message(message);
            this.messages.push(newMessage);

        }
    }


    add(message: Message) {
        this.messages.push(message);
    }

    allMessages(): Message[] {
        return this.messages
    }
    messages: IMessage[] = [];
}