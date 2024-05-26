"use client";

import { useState } from "react";
import KnowledgePage, {
  testData,
  TopicData,
} from "@/components/VideoContainer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [curData, setCurData] = useState<TopicData[]>([]);

  const onSearchBtnClick = (searchText: string) => {
    // TODO: SEND Search request for text
    const msg = { searchText };
    console.log(msg);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-900">
      <SearchBar isLoading={isLoading} onSearchBtnClick={onSearchBtnClick} />
      <KnowledgePage topics={testData} isLoading={isLoading} />
    </div>
  );
}

function SearchBar(props: {
  isLoading: boolean;
  onSearchBtnClick: (s: string) => any;
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
