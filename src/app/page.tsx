"use client";

import { useState } from "react";
import { v4 } from "uuid";
import KnowledgePage from "@/components/VideoContainer";

import {
  EducationLevel,
  TopicQuery,
  TopicResult,
  TopicResults,
} from "@/contracts";

const uuid = v4;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [topicResults, setTopicResults] = useState<TopicResults | null>(null);

  const [topicQuery, setTopicQuery] = useState<TopicQuery>({
    uuid: uuid(),
    topic: "",
    age: 15,
    education: EducationLevel.HIGH_SCHOOL,
  });

  const onSearchBtnClick = async (searchText: string) => {
    const topicQuery = { topic: searchText }; //TODO: this needs to be TopicQuery type
    const endpoint = "";
    setIsLoading(true);
    const result = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(topicQuery),
    });
    setIsLoading(false);
    if (result.ok) {
      const data = await result.json();
      setTopicResults(data);
    }
    // console.log(result);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-900">
      <SearchBar isLoading={isLoading} onSearchBtnClick={onSearchBtnClick} />
      <KnowledgePage topicResults={topicResults} isLoading={isLoading} />
    </div>
  );
}

function Filters(props: { updateFilters: Function }) {
  return (
    <div className="flex flex-col">
      <div>{/* TODO: Finish */}</div>
    </div>
  );
}

function SearchBar(props: {
  isLoading: boolean;
  onSearchBtnClick: (s: string) => any;
  // setTopicQuery: Function
}) {
  const [text, setText] = useState<string>("");

  const onClick = () => {
    if (text.length === 0 || props.isLoading) return;
    props.onSearchBtnClick?.(text);
  };

  return (
    <div className="flex m-4 place-content-center join w-[80%] sm:w-[50%]">
      <input
        className="input input-primary input-md join-item focus:outline-none w-full opacity-70"
        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder="Search any topic... e.g. How to win a Hackathon"
        onKeyDown={(e) => {
          if (e.key === "Enter") onClick();
        }}
      />
      <button className="btn btn-primary join-item" onClick={onClick}>
        Search
      </button>
    </div>
  );
}
