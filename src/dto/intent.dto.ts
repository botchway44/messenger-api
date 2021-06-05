import { ConfirmationState, State } from ".";

export interface IIntent {
    confirmationState: ConfirmationState
    name: string
    slots: any,
    state: State,
    kendraResponse?: any
}

export class CreateIntent implements IIntent {
    constructor(
        public name: string,
        public confirmationState: ConfirmationState,
        public slots: any,
        public state: State,
        public kendraResponse?: any
    ) { }
}