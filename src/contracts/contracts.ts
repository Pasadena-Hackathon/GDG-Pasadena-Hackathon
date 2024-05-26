import { YoutubeVideo } from "./youtube";

export enum EducationLevel {
    HIGH_SCHOOL,
    COLLEGE,
    GRADUATE,
    PHD
}

export interface TopicQuery {
    userId: string; // unique user id
    age: number;
    education: EducationLevel;
    topic: string;
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
