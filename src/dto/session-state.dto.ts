import { IDialogAction, IIntent } from ".";

export interface ISessionState {
    activeContexts?: any[],
    sessionAttributes: any,
    dialogAction: IDialogAction,
    intent: IIntent
}

export class SessionState implements ISessionState {
    constructor(
        public sessionAttributes: any,
        public dialogAction: IDialogAction,
        public intent: IIntent,
        public activeContexts?: any[],
    ) {

    }
}

