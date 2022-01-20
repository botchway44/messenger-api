import { IToken, Token } from "dto";

require("dotenv").config();
const fetch = require('node-fetch');


export class TokenService {

    client_id = process.env.CLIENT_ID;
    client_secret = process.env.CLIENT_SECRET;
    audience = process.env.AUTH0_AUDIENCE;
    redirect_uri = process.env.REDIRECT_URI;

    _URL = "https://botchway44.us.auth0.com/oauth/token";
    GRANT_TYPE = "client_credentials";

    server_token: Token | undefined;

    constructor() {

    }

    async retriveToken() {

        const body = {
            "client_id": this.client_id,
            "client_secret": this.client_secret,
            "audience": this.audience,
            "redirect_uri": this.redirect_uri,
            "grant_type": this.GRANT_TYPE
        };

        try {
            const res = await fetch(this._URL, {
                method: 'post',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            });

            this.server_token = await res.json();
            return this.server_token?.access_token;

        } catch (error) {
            this.server_token = undefined;
            return null;
        }



    }

    getToken(token: string) {
        return this.server_token?.access_token
    }

    async getUserProfile(access_token: string): Promise<any | null> {
        const USER_URL = "https://botchway44.us.auth0.com/userinfo";

        try {
            const user_info = await fetch(USER_URL, {
                method: 'get',
                headers: {
                    Authorization: "Bearer " + access_token,
                },
            });

            return await user_info.json();

        } catch (error) {
            return null;
        }

    }
}