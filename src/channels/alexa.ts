import { AccountService, TokenService } from "../service";

require("ask-sdk-model")
const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const Alexa = require('ask-sdk-core');
const app = express();
const skillBuilder = Alexa.SkillBuilders.custom();

// CLIENTS SETUP
let tokenService: TokenService;
let accountService: AccountService;


// const LaunchRequestHandler = {
//     canHandle(handlerInput) {
//         return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
//     },
//     handle(handlerInput) {
//         const speechText = 'Hello from Expresss running on TypeKit.com';

//         return handlerInput.responseBuilder
//             .speak(speechText)
//             .reprompt(speechText)
//             .withSimpleCard('Hello World', speechText)
//             .getResponse();
//     }
// };

const LaunchRequestHandler = {
    canHandle(handlerInput: any) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput: any) {
        let accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

        if (accessToken === undefined) {
            var speechText = "Please use the Alexa companion app to authenticate with your Amazon account to start using this skill.";

            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
        } else {
            let accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

            let url = `https://api.amazon.com/user/profile?access_token=${accessToken}`;
            /*
            * data.user_id : "amzn1.account.xxxxxxxxxx"
            * data.email : "steve@dabblelab.com"
            * data.name : "Steve Tingiris"
            * data.postal_code : "33607"
            */
            const user = await tokenService.getUserProfile(accessToken);

            console.log(JSON.stringify(user));

            let outputSpeech = 'This is the default message.';


            if (user) {
                outputSpeech = 'Hello ' + user.nickname + ", how may i help you with your account.";
            } else {
                outputSpeech = 'Hello, I couldnt get your user details, kindly try linking your account again.';
            }



            return handlerInput.responseBuilder
                .speak(outputSpeech)
                .withLinkAccountCard()
                .getResponse();
        }
    },
};


const AccountBalanceIntentHandler = {
    canHandle(handlerInput: any) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'BalanceIntent';
    },
    async handle(handlerInput: any) {

        console.log("AccountBalanceIntent Fandler", JSON.stringify(handlerInput))
        let accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

        // set user into session storage
        const user = await tokenService.getUserProfile(accessToken);
        console.log(JSON.stringify(user));

        // const nameSlot = handlerInput.requestEnvelope.request.intent.slots.name.value;
        let speechText = `Hello`;

        if (user) {
            const token = tokenService.server_token?.access_token + "";
            console.log("token", token);
            const user_account = await accountService.getAccount(user.email, token);

            console.log(JSON.stringify(user_account));

            if (user_account)
                speechText = `Your account balance is ${user_account.account.balance} ghana cedis`;
            else speechText = `I couldnt retrieve your account balance, try that again`;

        } else {
            speechText = "Please Link your account again"
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .withLinkAccountCard()
            .getResponse();
    },
};

const LastTransactionIntentHandler = {
    canHandle(handlerInput: any) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'LastTransactionIntent';
    },
    async handle(handlerInput: any) {
        let speechText = `Please link your account from the Alexa app`;

        console.log("Last Transaction Fandler", JSON.stringify(handlerInput))
        let accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

        if (accessToken) {
            // set user into session storage
            const user = await tokenService.getUserProfile(accessToken);
            console.log(JSON.stringify(user));

            // const nameSlot = handlerInput.requestEnvelope.request.intent.slots.name.value;

            if (user) {
                const token = tokenService.server_token?.access_token + "";
                console.log("token", token);
                const transaction = await accountService.getLastTransaction(user.email, token);


                console.log(JSON.stringify(transaction));

                if (transaction)
                    // speechText = 'Your last transaction was on' + convertToMoment(transaction.lastTransaction.date) + " and your balance after was " + transaction.lastTransaction.balance;
                    speechText = 'Your last transaction was on' + " and your balance after was " + transaction.lastTransaction.balance;
                else speechText = `I couldnt retrieve your account balance, try that again`;

            }
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .withLinkAccountCard()
            .getResponse();
    },
};


const HelpIntentHandler = {
    canHandle(handlerInput: any) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput: any) {
        console.log("Handler", JSON.stringify(handlerInput))

        const speechText = 'You can introduce yourself by telling me your name';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput: any) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput: any) {
        console.log("Handler", JSON.stringify(handlerInput))


        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput: any) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput: any) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason} `);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput: any, error: any) {
        console.log(`Error handled: ${error.message} `);

        return handlerInput.responseBuilder
            .speak(`Sorry I ran into an error.The error message was: ${error.message} `)
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};


/******************************** */


skillBuilder.addRequestHandlers(
    LaunchRequestHandler,
    AccountBalanceIntentHandler,
    LastTransactionIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    ErrorHandler
)

const skill = skillBuilder.create();

const adapter = new ExpressAdapter(skill, false, false);
const AlexaHandler = adapter.getRequestHandlers();
console.log(AlexaHandler);

export {
    AlexaHandler
}

// Post request
