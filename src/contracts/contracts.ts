import { YoutubeVideo } from "./youtube";

export enum EducationLevel {
    HIGH_SCHOOL = 'High School',
    COLLEGE = 'University/College',
    GRADUATE = 'Graduate Program',
    PHD = 'PhD',
}

export interface TopicQuery {
    userId: string; // unique user id
    age: number;
    education: EducationLevel;
    topic: string;
}

export interface TopicSuggestQuery {
    userId: string;
    topics: string[];
}

export interface TopicResults {
    results: TopicResult[];
    youtubeCategory: string;
}

export interface TopicResult {
    title: string
    summary: string
    query: string
    relevancy: number
    videos: YoutubeVideo[]
}

export interface PromptResult extends TopicResult {
    category: string;
}
