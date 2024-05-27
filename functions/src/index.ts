/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {v4} from 'uuid';
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {defineSecret} from "firebase-functions/params";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import {
    PromptResult,
    TopicQuery,
    TopicResult, TopicSuggestQuery,
    youtubeCategoriesFormatted, youtubeCategoryList, YoutubeVideo,
    YoutubeVideoResult
} from "../../src/contracts";
import {google} from 'googleapis';
import * as admin from 'firebase-admin';
import {ChatMessageHistory} from "langchain/memory";

const apiKey = defineSecret('GEMINI_API_KEY');

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

function getModel() {
    return new ChatGoogleGenerativeAI({
        apiKey: apiKey.value(),
        model: 'gemini-1.5-flash'
    })
}

let inited = admin.apps.length > 0;

if (!inited) {
    inited = true;
    try {
        admin.initializeApp();
        admin.firestore().settings({
            ignoreUndefinedProperties: true,
        });
    } catch (err) {
        logger.error(err);
    }
}

async function youtubeApiCall(endpoint: string, params: any) {
    const youtube = google.youtube({ version: 'v3', auth: apiKey.value() });
    // Uncomment locally, and use a hard-coded key for demo, then run `npx firebase deploy --only=functions`
    // const youtube = google.youtube({ version: 'v3', auth: 'replace-with-your-key' });
    const response = await (youtube as any)[endpoint].list({...params});
    return response.data;
}

const historyMap = new Map<string, ChatMessageHistory>();

const hardCodedResults = {
    "kind": "youtube#searchListResponse",
    "etag": "wymlYzQ4T7aoBLHAi-17m93kSJ0",
    "nextPageToken": "CAoQAA",
    "regionCode": "US",
    "pageInfo": {
        "totalResults": 72285,
        "resultsPerPage": 10
    },
    "items": [
        {
            "kind": "youtube#searchResult",
            "etag": "qGz_1tfTvwrtbqTkbPnx5XpceP8",
            "id": {
                "kind": "youtube#video",
                "videoId": "hmdaG1GeglI"
            },
            "snippet": {
                "publishedAt": "2021-08-05T18:00:13Z",
                "channelId": "UC6YyIqvJYIqfGLdHXzIMeww",
                "title": "How to Publish a Book as a Teenager",
                "description": "This is how I published my first book at 15 years old! Been workin' on this bad boy for 50 years... HERE IS MY BOOK LINK!!",
                "thumbnails": {
                    "default": {
                        "url": "https://i.ytimg.com/vi/hmdaG1GeglI/default.jpg",
                        "width": 120,
                        "height": 90
                    },
                    "medium": {
                        "url": "https://i.ytimg.com/vi/hmdaG1GeglI/mqdefault.jpg",
                        "width": 320,
                        "height": 180
                    },
                    "high": {
                        "url": "https://i.ytimg.com/vi/hmdaG1GeglI/hqdefault.jpg",
                        "width": 480,
                        "height": 360
                    }
                },
                "channelTitle": "Madalyn Mac",
                "liveBroadcastContent": "none",
                "publishTime": "2021-08-05T18:00:13Z"
            }
        },
        {
            "kind": "youtube#searchResult",
            "etag": "fDwZyzZVSHkr7V8L-0dxErG1Lhg",
            "id": {
                "kind": "youtube#video",
                "videoId": "ApF7g8leh7M"
            },
            "snippet": {
                "publishedAt": "2024-02-26T13:50:03Z",
                "channelId": "UCEvn08jdRJ8iCmehs7hVNIw",
                "title": "Create a Children&#39;s Book to Sell on Amazon KDP | Step by Step Tutorial to Self-Publish in 2024",
                "description": "Ever dreamt of writing a children's story book? Turn that dream into reality! In this video, I'll guide you through creating and ...",
                "thumbnails": {
                    "default": {
                        "url": "https://i.ytimg.com/vi/ApF7g8leh7M/default.jpg",
                        "width": 120,
                        "height": 90
                    },
                    "medium": {
                        "url": "https://i.ytimg.com/vi/ApF7g8leh7M/mqdefault.jpg",
                        "width": 320,
                        "height": 180
                    },
                    "high": {
                        "url": "https://i.ytimg.com/vi/ApF7g8leh7M/hqdefault.jpg",
                        "width": 480,
                        "height": 360
                    }
                },
                "channelTitle": "Ivy Hang",
                "liveBroadcastContent": "none",
                "publishTime": "2024-02-26T13:50:03Z"
            }
        },
        {
            "kind": "youtube#searchResult",
            "etag": "nfRtr0jsUwwKCWyF7LqX6GMCSFA",
            "id": {
                "kind": "youtube#video",
                "videoId": "BZja9NpjQ8Q"
            },
            "snippet": {
                "publishedAt": "2022-12-14T00:13:28Z",
                "channelId": "UCZil6bPPu4gaGroOoFhOlTA",
                "title": "Amazon KDP journals low content books #stationery",
                "description": "",
                "thumbnails": {
                    "default": {
                        "url": "https://i.ytimg.com/vi/BZja9NpjQ8Q/default.jpg",
                        "width": 120,
                        "height": 90
                    },
                    "medium": {
                        "url": "https://i.ytimg.com/vi/BZja9NpjQ8Q/mqdefault.jpg",
                        "width": 320,
                        "height": 180
                    },
                    "high": {
                        "url": "https://i.ytimg.com/vi/BZja9NpjQ8Q/hqdefault.jpg",
                        "width": 480,
                        "height": 360
                    }
                },
                "channelTitle": "Tawana Simone",
                "liveBroadcastContent": "none",
                "publishTime": "2022-12-14T00:13:28Z"
            }
        }
    ]
}

export const topicStart = onRequest({
    secrets: [apiKey],
    cors: true,
}, async (request, response) => {

    const data = request.body as TopicQuery;

    data.userId = data.userId || v4();

    const prompt = `
I am a ${data.age} year old person with a ${data.education} degree.

These are all youtube categories we can use:

${youtubeCategoriesFormatted}

Suggest three topics that will help me learn about "${data.topic}".
For each topic, provide a related YouTube search query about the topic, its youtube category, a summary, and a relevancy score from 1-10.
Format the results as a raw json array with the fields "title", "summary", "query", "relevancy", "category". Only return json.
`

    const model = getModel();

    const modelResponse = await model.invoke(prompt);

    const content = modelResponse.content as string;
    const results: PromptResult[] = JSON.parse(content.replace(/^```json/, '').replace(/```$/, ''));

    for (const result of results) {
        let videos: {items: YoutubeVideoResult[]};
        try {
            videos = await youtubeApiCall('search', {
                q: result.query,
                part: 'snippet',
                type: 'video',
                maxResults: 3,
                videoCategoryId: youtubeCategoryList.find(value => value.title === result.category)?.id,
            });
        } catch (err) {
            videos = hardCodedResults as any;
        }
        result.videos = videos.items.map((video): YoutubeVideo => ({
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            videoId: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            publishTime: video.snippet.publishTime,
            thumbnail: video.snippet.thumbnails.high || video.snippet.thumbnails.medium || video.snippet.thumbnails.default,
        }));
    }

    await admin.firestore().doc(`users/${data.userId}`).set({prompt});

    response.json({results, userId: data.userId});
});

export const topicSuggest = onRequest({
    secrets: [apiKey],
    cors: true,
}, async (request, response) => {

    const data = request.body as TopicSuggestQuery;

    // const beginningPrompt = (await admin.firestore().doc<{prompt: string}>(`users/${data.userId}`).get()).data();
    console.log(data)
});
