export interface VideoData {
  url: string;
  //TODO: ... other
}

export interface TopicData {
  topic: string;
  description: string;
  videos: VideoData[];
}

export const testData: TopicData[] = [
  {
    topic:
      "Topic really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really,",
    description:
      "some really, really, really, really, really, really, really, really, really, really, really, really,",
    videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
    ],
  },
  {
    topic: "Topic 2",
    description: "some description again",
    videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
    ],
  },
  {
    topic: "Topic 1",
    description: "some description",
    videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
    ],
  },
  {
    topic: "Topic 2",
    description: "some description again",
    videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
    ],
  },
  {
    topic: "Topic 1",
    description: "some description",
    videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
    ],
  },
  {
    topic: "Topic 2",
    description: "some description again",
    videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
    ],
  },
];

export function VideoContainer(props: { videoData: VideoData }) {
  //todo: thumbnail ?
  return (
    <div className="aspect-square border-2 border-red-500 place-content-center">
      <a href={props.videoData.url}>Goto</a>
    </div>
  );
}

export function TopicContainer(props: { topicData: TopicData }) {
  /**
   * Will hold title, summary as to why, and links.
   */
  //   return (
  //     <div className="flex flex-row">
  //       {/* title and desc */}
  //       <div className="flex flex-col gap-4 border-2 border-purple-500 p-4 items-center">
  //         <div className="text-xl">{props.topicData.topic}</div>
  //         <div className="text-sm">{props.topicData.description}</div>
  //       </div>
  //       {/* videos */}
  //       <div className="flex flex-row">
  //         {props.topicData.videos.map((vid, index) => (
  //           <VideoContainer key={index} videoData={vid} />
  //         ))}
  //       </div>
  //     </div>
  //   );

  return (
    <div className="flex flex-col sm:flex-row border-2">
      <TopicInfo topicData={props.topicData} />
      {/* videos */}
      <div className="grid grid-flow-row grid-cols-2 sm:grid-cols-3 md:grid-cols-5 items-center auto-rows-auto w-full">
        {props.topicData.videos.map((vid, index) => (
          <div
            className="size-full m-2 border-2 place-content-center"
            key={index}
          >
            <VideoContainer key={index} videoData={vid} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicInfo(props: { topicData: TopicData }) {
  return (
    <div className="flex flex-col border-2 border-purple-500 p-4 items-start text-left w-full sm:max-w-[30%] min-w-[30%] min-h-20">
      <div className="text-3xl font-bold opacity-50">
        {props.topicData.topic}
      </div>
      <div className="text-sm font-thin">{props.topicData.description}</div>
    </div>
  );
}

export default function KnowledgePage(props: {
  topics: TopicData[];
  isLoading: boolean;
}) {
  /**
   * contains all TopicContainers
   */
  return (
    //
    <div className="flex flex-col gap-2 border-2 border-white min-w-full max-w-screen">
      {props.topics.map((topicData, index) => (
        <TopicContainer key={index} topicData={topicData} />
      ))}
    </div>
  );
}
