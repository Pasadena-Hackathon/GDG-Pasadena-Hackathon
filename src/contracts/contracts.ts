import {YoutubeVideoResult} from "@/contracts/youtube";

export enum EducationLevel {
    HIGH_SCHOOL,
    COLLEGE,
    GRADUATE,
    PHD
}

export interface TopicQuery {
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
    videos: YoutubeVideoResult[]
}
