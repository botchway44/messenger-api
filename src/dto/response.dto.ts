import { IDialogAction, IIntent, IMessage, ISessionState } from ".";

export interface IResponse {

}

const allInvocationSource = ["DialogCodeHook", "FulfillmentCodeHook"]
export type InvocationSource = typeof allInvocationSource[number];


// const allInputMode = ["DTMF", "Speech", "Text"];
// export type InputMode = typeof allInputMode[number];
export type InputMode = "DTMF" | "Speech" | "Text";


// const allConfirmationState = ["Confirmed", "Denied", "None"]
// export type ConfirmationState = typeof allConfirmationState[number];
export type ConfirmationState = "Confirmed" | "Denied" | "None";

// const allResponseContentType = ["CustomPayload", "ImageResponseCard", "PlainText", "SSML"]
// export type ResponseContentType = typeof allResponseContentType[number];
export type ResponseContentType = "CustomPayload" | "ImageResponseCard" | "PlainText" | "SSML";

// export type ResponseContentType = "CustomPayload " | " ImageResponseCard " | " PlainText " | " SSML";
// const allDialogActionType = ["Close", "ConfirmIntent", "Delegate", "ElicitIntent", "ElicitSlot"]
// export type DialogActionType = typeof allDialogActionType[number];
export type DialogActionType = "Close" | "ConfirmIntent" | "Delegate" | "ElicitIntent" | "ElicitSlot";

// const allStates = ["Failed", "Fulfilled", "InProgress", "ReadyForFulfillment"]
// export type State = typeof allStates[number];
export type State = "Failed" | "Fulfilled" | "InProgress" | "ReadyForFulfillment";



export interface IBot {
    id: string,
    name: string,
    aliasId: string,
    localeId: string,
    version: string
}

export interface ISlot {
    string: {
        value: {
            interpretedValue: string,
            originalValue: string,
            resolvedValues: string[]
        }
    }
}


export interface ISentimentResponse {
    sentiment: string,
    sentimentScore: {
        mixed: number,
        negative: number,
        neutral: number,
        positive: number
    }
}



export interface IInterpretations {

    intent: IIntent;
    nluConfidence: any,
    sentimentResponse: ISentimentResponse
    originatingRequestId?: string
}



export interface IIInputResponse {
    timestamp: string;
    operationName: string;
    messages: IMessage[];
    messageVersion: string,
    requestId: string;
    sessionId: string;
    inputTranscript: string;
    developerOverride: boolean;
    missedUtterance: boolean;
    invocationSource: InvocationSource;
    inputMode: InputMode;
    responseContentType: ResponseContentType;
    bot: IBot;
    interpretations: IInterpretations[],
    requestAttributes: any,
    sessionState: ISessionState

}