

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

const FAKE_DATA: IAccount[] = [
    {
        balance: 2000,
        email: 'noelnuel44@gmail.com',
        transactions: [
            {
                date: "2021-05-31T15:31:17.820326Z",
                type: "ATM CASH WITHDRAWAL SBG KNUST1",
                amount: -200,
                balance: 3000
            },
            {
                date: "2021-05-31T15:31:17.820326Z",
                type: "ATM CASH WITHDRAWAL SBG KNUST1",
                amount: 200,
                balance: 3200
            }
        ]

    },
    {
        "balance": 2000,
        "email": 'noelnuel44@gmail.com',
        "transactions": [
            {
                "date": "2021-05-31T15:31:17.820326Z",
                "type": "ATM CASH WITHDRAWAL SBG KNUST1",
                "amount": -200,
                "balance": 3000
            }
        ]

    }
]