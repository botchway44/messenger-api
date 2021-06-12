

export interface ITransaction {
    date: string;
    type: string;
    amount: number;
    balance: number;
}

export class Transaction {
    constructor(
        public date: string,
        public type: string,
        public amount: number,
        public balance: number
    ) { }
}


export interface IAccount {
    balance: number
    email: string
    transactions: ITransaction[]
}



export class Account implements IAccount {

    constructor(
        public balance: number,
        public email: string,
        public transactions: ITransaction[],
    ) { }
}
