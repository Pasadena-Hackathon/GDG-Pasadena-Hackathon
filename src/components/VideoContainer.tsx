export interface VideoData {
  url: string;
  //TODO: ... other
}

export interface TopicData {
  title: string;
  description: string;
  videos: VideoData[];
}

export const testData = [
  {
    title: "Title 1",
    description: "some description",
    videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D",
      },
    ],
  },
  {
    title: "Title 2",
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
    <div className="p-10 aspect-square border-2 border-red-500">
      <a href={props.videoData.url}>Goto</a>
    </div>
  );
}

export function TopicContainer(props: { topicData: TopicData }) {
  /**
   * Will hold title, summary as to why, and links.
   */
  return (
    <div className="flex flex-row">
      {/* title and desc */}
      <div className="flex flex-col gap-4 border-2 border-purple-500">
        <div className="text-xl">{props.topicData.title}</div>
        <div className="text-sm">{props.topicData.description}</div>
      </div>
      {/* videos */}
      <div className="flex flex-row">
        {props.topicData.videos.map((vid, index) => (
          <VideoContainer key={index} videoData={vid} />
        ))}
      </div>
    </div>
  );
}

export default function KnowledgePage(props: { topics: TopicData[] }) {
  /**
   * contains all TopicContainers
   */
  return (
    <div className="flex flex-col gap-2 border-2 border-white min-w-full">
      {props.topics.map((topicData, index) => (
        <TopicContainer key={index} topicData={topicData} />
      ))}
    </div>
  );
}
