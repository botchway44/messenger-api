export interface IToken {

    access_token: string
    expires_in: number,
    token_type: string

}

export class Token implements IToken {
    constructor(
        public access_token: string,
        public expires_in: number,
        public token_type: string,
    ) { }

}