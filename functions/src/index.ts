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
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import {
    PromptResult,
    TopicQuery,
    TopicResult,
    youtubeCategoriesFormatted, youtubeCategoryList, YoutubeVideo,
    YoutubeVideoResult
} from "../../src/contracts";
import {google} from 'googleapis';

const apiKey = defineSecret('GEMINI_API_KEY');

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

function getModel() {
    return new ChatGoogleGenerativeAI({
        apiKey: apiKey.value(),
        model: 'gemini-1.5-flash'
    })
}

async function youtubeApiCall(endpoint: string, params: any) {
    const youtube = google.youtube({ version: 'v3', auth: apiKey.value() });
    try {
        const response = await (youtube as any)[endpoint].list({...params});
        return response.data;
    } catch (err) {
        console.error('Error making API request:', err);
        return null;
    }
}

export const topicStart = onRequest({
    secrets: [apiKey],
}, async (request, response) => {

    const data = request.body as TopicQuery;

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

    // const results = [
    //     {
    //         "title": "Understanding the Publishing Process",
    //         "summary": "This topic covers the various stages of getting your book published, from writing and editing to marketing and distribution. You'll learn about traditional publishing houses, self-publishing options, and the different roles involved in the process.",
    //         "query": "how to publish a book",
    //         "relevancy": 9,
    //         "category": "Education"
    //     },
    //     {
    //         "title": "Crafting a Compelling Manuscript",
    //         "summary": "This topic focuses on the writing and editing process, covering aspects like outlining, character development, plot structure, and finding a professional editor. You'll gain valuable insights into crafting a strong and engaging manuscript.",
    //         "query": "writing a book for beginners",
    //         "relevancy": 8,
    //         "category": "Education"
    //     },
    //     {
    //         "title": "Marketing and Promoting Your Book",
    //         "summary": "This topic explores effective strategies for marketing and promoting your book after publication. You'll learn about building an author platform, social media marketing, book reviews, and strategies for reaching your target audience.",
    //         "query": "book marketing for authors",
    //         "relevancy": 7,
    //         "category": "Howto & Style"
    //     }
    // ] as PromptResult[];

    for (const result of results) {
        const videos: {items: YoutubeVideoResult[]} = await youtubeApiCall('search', {
            q: result.query,
            part: 'snippet',
            type: 'video',
            maxResults: 3,
            videoCategoryId: youtubeCategoryList.find(value => value.title === result.category)?.id,
        });
        console.log({videos})
        result.videos = videos.items.map((video): YoutubeVideo => ({
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            videoId: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            publishTime: video.snippet.publishTime,
            thumbnail: video.snippet.thumbnails.high || video.snippet.thumbnails.medium || video.snippet.thumbnails.default,
        }));
    }

    response.json({results});
});

export const topicSuggest = onRequest({
    secrets: [apiKey],
}, (request, response) => {
    logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase topicSuggest!");
});
