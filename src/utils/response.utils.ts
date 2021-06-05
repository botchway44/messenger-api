import {
    ResponseContentType,
    IMessage,
    Message,
    IIntent,
    CreateIntent,
    ConfirmationState,
    State,
    DialogAction,
    DialogActionType,
    CloseResquestResponse,
    IDialogAction,
    SessionState,
    ISlot,
    MessageBuilder
} from "../dto";

export const createMessage = (message: string, type: ResponseContentType): IMessage => new Message(message, type)


export const createIntent = (
    name: string,
    confirmationState: ConfirmationState,
    slots: any,
    state: State,
): IIntent => new CreateIntent(name, confirmationState, slots, state);


export const createDialogAction = (type: DialogActionType): IDialogAction => new DialogAction(type);

export const createCloseResponseDTO = (
    sessionAttributes: any,
    slots: any,
    intentName: string,
    fulfilmentState: State,
    confirmationState: ConfirmationState,
    message: string[]
) => new CloseResquestResponse(
    new SessionState(
        sessionAttributes,
        createDialogAction("Close"),
        createIntent(
            intentName,
            confirmationState,
            slots,
            fulfilmentState
        )
    ),
    new MessageBuilder(message).allMessages()
);