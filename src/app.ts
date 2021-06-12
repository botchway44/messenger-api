// Import the appropriate service and chosen wrappers
import { Card, conversation, Image, List, Simple, Suggestion } from '@assistant/conversation';
import { Mode } from '@assistant/conversation/dist/api/schema';
import { AuthHeaderProcessor } from '@assistant/conversation/dist/auth';
import { IAccount } from 'utils/account.dto';
import { ITask } from './dto';
import { ASSISTANT_LOGO_IMAGE, buildEntriesList, buildItemsList, decodeUser, handleAddTasks, MongoClientConnection } from './utils';
import { CreateNewTask } from './utils';

// const { actionssdk, SignIn } = require('actions-on-google');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const fs = require('fs')
require('dotenv').config();




const app = express();
const jsonParser = bodyParser.json();

let mongoClient: MongoClientConnection;




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

if (
    !process.env.AUTH0_DOMAIN ||
    !process.env.AUTH0_AUDIENCE ||
    !process.env.AUTH0_API_SECRET
) {
    throw 'Make sure you have AUTH0_DOMAIN, AUTH0_AUDIENCE, and AUTH0_API_SECRET in your .env file';
}

app.use(cors());

// Authentication middleware. When used, the
// access token must exist and be verified against
// the signing secret for the API
const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
    secret: process.env.AUTH0_API_SECRET,
    // Validate the audience and the issuer.
    aud: process.env.AUTH0_AUDIENCE,
    issuer: `${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['HS256']
});


const checkScopes = jwtAuthz(['read:messages']);

app.get('/api/public', function (req: any, res: any) {
    res.json({
        message: "Hello from a public endpoint! You don't need to be authenticated to see this."
    });
});

app.get('/api/v1/balance/:email', async function (req: any, res: any) {
    const email = req.params.email;
    console.log(email)
    // there is email
    if (email) {
        const data = await mongoClient.getAccount(email);

        res.status("200").json({ balance: data.balance });

    } else {
        res.status("404").json({ error: "getting account failed" });
    }

});

app.get('/api/v1/public', function (req: any, res: any) {
    res.json({
        message: "Hello from a public endpoint! You don't need to be authenticated to see this."
    });
});



app.get('/api/v1/account/:email', checkJwt, async function (req: any, res: any) {

    const email = req.params.email;

    // there is email
    if (email) {
        const data: IAccount = await mongoClient.getAccount(email);

        res.status("200").json({ account: data });

    } else {
        res.status("404").json({ error: "getting account failed" });
    }

});

app.get('/api/v1/transactions/:email', checkJwt, async function (req: any, res: any) {

    const email = req.params.email;

    // there is email
    if (email) {
        const data: IAccount = await mongoClient.getAccount(email);

        res.status("200").json({ transactions: data.transactions });

    } else {
        res.status("404").json({ error: "task failed" });

    }

});

app.get('/api/v1/last_transaction/:email', checkJwt, async function (req: any, res: any) {

    const email = req.params.email;

    // there is email
    if (email) {
        const data: IAccount = await mongoClient.getAccount(email);

        res.status("200").json({ lastTransaction: data.transactions[data.transactions.length - 1] });

    } else {
        res.status("404").json({ error: "task failed" });

    }

});


app.get('/api/v1/private-scoped', checkJwt, checkScopes, function (req: any, res: any) {
    res.json({
        message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
    });
});


//index route
app.post("/api/v1/transactions", checkJwt, async (req: any, res: any) => {
    const body = req.body;
    console.log(body);
    // there is body
    if (body) {
        const data = await mongoClient.addTask(body);

        res.status("200").json({ account: data });

    } else {
        res.status("404").json({ error: "task failed" });

    }

});



app.use(function (err: any, req: any, res: any, next: any) {
    console.error(err.stack);
    return res.status(err.status).json({ message: err.message });
});


// Starting the App
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    mongoClient = new MongoClientConnection();

    mongoClient.connect().then(() => {
        console.log("App is running on port " + PORT);
        console.log("Database is connected");

    })
});

