import { IMessage, ISessionState } from ".";

export interface ICloseResquestResponse {
    sessionState: ISessionState;
    messages: IMessage[];
}


export class CloseResquestResponse implements ICloseResquestResponse {
    constructor(public sessionState: ISessionState, public messages: IMessage[]) { }
}