// Import the appropriate service and chosen wrappers
import { Card, conversation, Image, List, Simple, Suggestion } from '@assistant/conversation';
import { Mode } from '@assistant/conversation/dist/api/schema';
import { AuthHeaderProcessor } from '@assistant/conversation/dist/auth';
import { IAccount } from 'utils/account.dto';
import { ITask } from './dto';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';

import { ASSISTANT_LOGO_IMAGE, buildEntriesList, buildItemsList, decodeUser, handleAddTasks, MongoClientConnection } from './utils';
// const { actionssdk, SignIn } = require('actions-on-google');
import { AlexaHandler } from "./channels/alexa";
import { GoogleAssistantHandler } from './channels/google_assistant';
import { MongoDBClient } from './service/mongo.service';

import { TYPES } from './utils/types';

const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const cors = require('cors');
const bodyParser = require('body-parser');
import './controller/home';


require('dotenv').config();
// load everything needed to the Container
let container = new Container();
container.bind<MongoDBClient>(TYPES.MongoDBClient).to(MongoDBClient);

let mongoClient: MongoClientConnection;


if (process.env.NODE_ENV === 'development') {
    let logger = makeLoggerMiddleware();
    container.applyMiddleware(logger);
}



if (
    !process.env.AUTH0_DOMAIN ||
    !process.env.AUTH0_AUDIENCE ||
    !process.env.AUTH0_API_SECRET
) {
    throw 'Make sure you have AUTH0_DOMAIN, AUTH0_AUDIENCE, and AUTH0_API_SECRET in your .env file';
}


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

// start the server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    //   app.use(helmet());
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());


app.get('/api/public', function (req: any, res: any) {
    res.json({
        message: "Hello from a public endpoint! You don't need to be authenticated to see this."
    });
});

app.get('/api/v1/balance/:email', checkJwt, async function (req: any, res: any) {
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

// Add handler for alexa
app.post('/api/v1/alexa', AlexaHandler);
app.post('/api/v1/googleassistant', GoogleAssistantHandler);

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






});

// Starting the App
const PORT = process.env.PORT || 3000;
let app = server.build();
app.listen(3000, () => console.log(`Listening on port ${PORT}`));

// app.listen(PORT, () => {
//     mongoClient = new MongoClientConnection();

//     mongoClient.connect().then(() => {
//         console.log("App is running on port " + PORT);
//         console.log("Database is connected");

//     })
// });

