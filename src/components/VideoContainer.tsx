import { TopicResults, TopicResult, YoutubeVideoResult } from "@/contracts";

export interface VideoData {
  url: string;
  //TODO: ... other
}

export function VideoResult(props: { videoResult: YoutubeVideoResult }) {
  //todo: thumbnail ?
  const videoUrl = `https://www.youtube.com/watch?v=${props.videoResult.channelId}`;
  const thumbnailUrl = props.videoResult.thumbnails.default.url;
  return (
    <div className="aspect-square  place-content-center">
      <a href={videoUrl}>
        <img src={"https://i.ytimg.com/vi/r0VgFZv7o0k/default.jpg"}></img>
      </a>
    </div>
  );
}

export function TopicContainer(props: { topicResult: TopicResult }) {
  /**
   * Will hold title, summary as to why, and links.
   */
  return (
    <div className="flex flex-col sm:flex-row ">
      <TopicInfo topicResult={props.topicResult} />
      {/* videos */}
      <div className="grid grid-flow-row grid-cols-2 sm:grid-cols-3 md:grid-cols-5 items-center auto-rows-auto w-full">
        {props.topicResult.videos.map((vid, index) => (
          <div className="size-full m-2 place-content-center" key={index}>
            <VideoResult key={index} videoResult={vid} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicInfo(props: { topicResult: TopicResult }) {
  return (
    <div className="flex flex-col  p-4 items-start text-left w-full sm:max-w-[30%] min-w-[30%] min-h-20">
      <div className="text-3xl font-bold opacity-50">
        {props.topicResult.title}
      </div>
      <div className="text-sm font-thin">{props.topicResult.summary}</div>
    </div>
  );
}

export default function KnowledgePage(props: {
  topicResults: TopicResults | null;
  isLoading: boolean;
}) {
  /**
   * contains all TopicContainers
   */
  return (
    //
    <div className="flex flex-col gap-2  min-w-full max-w-screen">
      {props.topicResults?.results.map((topicData, index) => (
        <>
          <TopicContainer key={index} topicResult={topicData} />
          <div className="divider" />
        </>
      ))}
    </div>
  );
}
