// Import the appropriate service and chosen wrappers
require("ask-sdk-model")
import { IAccount } from 'utils/account.dto';
import { MongoClientConnection } from './utils';
import { AlexaHandler, AlexaAdapter } from "./channels/alexa";
import { GoogleAssistantHandler } from './channels/google_assistant';
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();

let mongoClient: MongoClientConnection;

// app.use(express.json());

// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.raw());

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


app.use(function (err: any, req: any, res: any, next: any) {
    console.error(err.stack);
    return res.status(err.status).json({ message: err.message });
});


// Add handler for alexa
app.post('/api/v1/alexa', AlexaAdapter.getRequestHandlers());
app.post('/api/v1/googleassistant', express.json(), GoogleAssistantHandler);

app.get('/api/public', express.json(), function (req: any, res: any) {
    res.json({
        message: "Hello from a public endpoint! You don't need to be authenticated to see this."
    });
});


app.post('/api/v1/public', express.json(), function (req: any, res: any) {
    console.log(req.body);
    res.json({
        message: "Hello from a public endpoint! You don't need to be authenticated to see this."
    });
});


app.get('/api/v1/private-scoped', express.json(), checkJwt, checkScopes, function (req: any, res: any) {
    res.json({
        message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
    });
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

