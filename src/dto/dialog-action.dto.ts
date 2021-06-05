import { DialogActionType } from ".";

export interface IDialogAction {
    slotToElicit?: string,
    type: DialogActionType

}

export class DialogAction implements IDialogAction {

    constructor(
        public type: DialogActionType,
        public slotToElicit?: string
    ) { }
}