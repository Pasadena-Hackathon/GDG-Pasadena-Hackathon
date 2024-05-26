"use client";

// import Image from "next/image";
// import GraphTest from "@/components/GraphTest";
import KnowledgePage, { testData } from "@/components/VideoContainer";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center bg-slate-900">
      <SearchBar />
      <KnowledgePage topics={testData} />
    </div>
  );
}

function SearchBar() {
  return <input className="text-black" />;
}
