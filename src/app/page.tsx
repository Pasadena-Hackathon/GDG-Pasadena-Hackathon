"use client";

import { useEffect, useState } from "react";
import { v4 } from "uuid";
import KnowledgePage from "@/components/VideoContainer";
import { testTopicResults } from "@/contracts/test_data";

import {
  EducationLevel,
  TopicQuery,
  TopicResult,
  TopicResults,
} from "@/contracts";

const UUID = v4;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [topicResults, setTopicResults] = useState<TopicResults | null>(null);
  const [userId, setUserId] = useState<string>(UUID());
  const [topicQuery, setTopicQuery] = useState({
    userId,
    topic: "",
    age: 15,
    education: EducationLevel.HIGH_SCHOOL,
  });

  const onSearchBtnClick = async () => {
    // const topicQuery = { topic: searchText }; //TODO: this needs to be TopicQuery type
    const endpoint = "https://topicstart-2u42nddpka-uc.a.run.app";
    // console.log("QUERY:" + topicQuery);
    console.log(JSON.stringify(topicQuery));
    // return;
    setIsLoading(true);
    const result = await fetch(endpoint, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(topicQuery),
    });
    // console.log(result);
    setIsLoading(false);
    if (result.ok) {
      const data = await result.json();
      setTopicResults(data);
    } else {
      alert("Error Loading results");
      setTopicResults(null);
    }
  };

  // useEffect(() => {
  //   console.log(topicQuery);
  // }, [topicQuery]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-900">
      <SearchBar
        topicQuery={topicQuery}
        isLoading={isLoading}
        onSearchBtnClick={onSearchBtnClick}
        setTopicQuery={setTopicQuery}
      />
      <Filters setTopicQuery={setTopicQuery} topicQuery={topicQuery} />
      <KnowledgePage topicResults={topicResults} isLoading={isLoading} />
    </div>
  );
}

function Filters(props: { topicQuery: TopicQuery; setTopicQuery: Function }) {
  const eduLevels = Object.values(EducationLevel);

  return (
    <div className="flex flex-col">
      <div>
        <label>{`Age: ${props.topicQuery.age}`}</label>
        <input
          type="range"
          min={0}
          max="100"
          value={props.topicQuery.age}
          className="range range-sm"
          onChange={(e) =>
            props.setTopicQuery((prev: TopicQuery) => ({
              ...prev,
              age: e.target.value,
            }))
          }
        />
      </div>

      <select className="select w-full max-w-xs select-sm">
        {eduLevels.map((el, index) => (
          <option
            key={index}
            onClick={(e) =>
              props.setTopicQuery(
                (prev: TopicQuery): TopicQuery => ({
                  ...prev,
                  education: el,
                })
              )
            }
          >
            {el}
          </option>
        ))}
      </select>
    </div>
  );
}

function SearchBar(props: {
  isLoading: boolean;
  topicQuery: TopicQuery;
  onSearchBtnClick: (s: string) => any;
  setTopicQuery: Function;
}) {
  const [text, setText] = useState<string>("");

  const onClick = () => {
    if (text.length === 0 || props.isLoading) return;
    props.setTopicQuery((prev: TopicQuery) => ({ ...prev, topic: text }));
    props.onSearchBtnClick?.(text);
  };

  return (
    <div className="flex m-4 place-content-center join w-[80%] sm:w-[50%] text-white">
      <input
        className="input input-primary input-md join-item focus:outline-none w-full opacity-70"
        onChange={(e) => {
          setText(e.target.value);
          props.setTopicQuery((prev: TopicQuery) => ({
            ...prev,
            topic: e.target.value,
          }));
        }}
        value={text}
        placeholder="Search any topic to learn..."
        onKeyDown={(e) => {
          if (e.key === "Enter") onClick();
        }}
      />
      <button
        // className={`btn btn-primary join-item ${
        //   props.isLoading && `loading loading-dots`
        // }`}
        className={`btn btn-primary join-item`}
        onClick={onClick}
        disabled={props.isLoading}
      >
        {props.isLoading ? "Loading..." : "Learn"}
      </button>
    </div>
  );
}
