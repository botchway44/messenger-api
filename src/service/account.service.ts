


const fetch = require('node-fetch');
require("dotenv").config();

export class AccountService {

    _URL = "https://stanbic-assistant-api.herokuapp.com/api/v1/";

    async getAccount(email: string, token: string) {
        console.log(token);
        console.log(email);

        // account/noelnuel44@gmail.com
        const path = this._URL + "account/" + email

        console.log(path)
        try {
            const res = await fetch(path, {
                method: 'get',
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json'
                },
            });

            console.log("RESPONSE ", res)
            const account = await res.json();

            console.log(account);
            return account;

        } catch (error) {
            return null;
        }

    }

    async getTransaction(email: string, token: string) {

        // account/noelnuel44@gmail.com
        const path = this._URL + "transactions/" + email
        try {
            const res = await fetch(path, {
                method: 'get',
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json'
                },
            });


            return await res.json();

        } catch (error) {
            return null;
        }
    }

    async getLastTransaction(email: string, token: string) {

        // account/noelnuel44@gmail.com
        const path = this._URL + "last_transaction/" + email
        try {
            const res = await fetch(path, {
                method: 'get',
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json'
                },
            });

            // last transaction comes as camel case ==> lastTransaction

            return await res.json();

        } catch (error) {
            return null;
        }
    }

}