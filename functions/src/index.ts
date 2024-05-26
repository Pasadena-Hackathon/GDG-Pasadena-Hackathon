/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {defineSecret} from "firebase-functions/params";

const apiKey = defineSecret('GEMINI_API_KEY');

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const topicStart = onRequest({
    secrets: [apiKey],
}, (request, response) => {
    logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase topicStart!");
});

export const topicSuggest = onRequest({
    secrets: [apiKey],
}, (request, response) => {
    logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase topicSuggest!");
});
