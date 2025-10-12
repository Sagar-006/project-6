"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Youtube,{YouTubeProps} from 'react-youtube'
import {
  
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-react";
import axios from "axios";
import LiteYoutubeEmbed from "react-lite-youtube-embed";
import { YT_REGEX } from "@/lib/utils";

interface Video {
  id: string;
  type: string;
  title: string;
  url: string;
  extractedId: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  upvotes: number;
  haveUpvoted: boolean;
}

interface StreamViewType {
  userId: any;
}

const REFRESH_INTERVAL_MS = 10 * 1000;
export default function StreamView({ userId }: StreamViewType) {
  const [inputLink, setInputLink] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  // console.log("this is queue", queue);


  const currentVideoRef = useRef<Video | null>(null);
  useEffect(() => {
    currentVideoRef.current = currentVideo;
  }, [currentVideo]);

  async function refreshStreams() {
    const res = await axios.get(`/api/streams/my`, {
      withCredentials: true,
    });
    // console.log("this is incide refreshStreams function", res);
    const json = res.data.streams;
    setQueue(json)
    console.log("this is inside Refresh",queue)
    // console.log("this is Json data from my endpoint",json)
  }

  async function getStreams() {
    const streams = await axios.get(`/api/streams/?creatorId=${userId}`, {
      withCredentials: true,
    });
    // console.log("this is streams data", streams.data.streams);
    const fetchedStreams = streams.data.streams;

    setQueue(fetchedStreams);

    const current = currentVideoRef.current;
    if (!current && fetchedStreams.length > 0) {
      setCurrentVideo(fetchedStreams[0]);
    }else if(
      current && 
      !fetchedStreams.find((v:Video) => v.id === current.id)&&
      fetchedStreams.length > 0
    ){
      setCurrentVideo(fetchedStreams[0]);
    }
  }

  useEffect(() => {
    refreshStreams();
    // getStreams();
    const Interval = setInterval(() => {
      refreshStreams()
      // getStreams()
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(Interval)
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputLink.trim()) {
      alert("Please enter a YouTube link");
      return;
    }

    try {
      const res = await axios.post(
        `/api/streams`,
        { creatorId: userId, url: inputLink },
        { withCredentials: true }
      );
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.message || "Error adding song to queue");
    }
  };


  const handleVote = async (id: string, isUpvote: boolean) => {
    setQueue(
      queue
        .map((video) =>
          video.id === id
            ? {
                ...video,
                upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                haveUpvoted: !video.haveUpvoted,
              }
            : video
        )
        .sort((a, b) => b.upvotes - a.upvotes)
    );

    try {
      const res = await axios.post(
        `/api/streams/${isUpvote ? "downvote" : "upvote"}`,
        {
          userId: userId,
          streamId: id,
        },
        {
          withCredentials: true,
        }
      );

      // console.log("this is upvote res", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const playNext = () => {
     axios.delete(`/api/streams/${currentVideo?.id}`,{
      withCredentials:true,
    })
    // if (queue.length > 0) {
    //   setCurrentVideo(queue[0]);
    //   setQueue(queue.slice(1));
    // }
    if (!currentVideo) {
      if (queue.length > 0) setCurrentVideo(queue[0]);
      return;
    }

    const currentIndex = queue.findIndex((v) => v.id === currentVideo.id);
    console.log(currentIndex)

    if (currentIndex >= 0 && currentIndex + 1 < queue.length) {
      setCurrentVideo(queue[currentIndex + 1]);
    } else {
      console.log("End of queue");
      setCurrentVideo(null);
    }
  };

  console.log(queue)

  const embedurl = `https://www.youtube.com/embed/${currentVideo?.extractedId}?autoplay=1`;
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Song Voting Queue</h1>
          <Button
            variant="outline"
            className="bg-purple-600 hover:bg-purple-700 text-white border-0"
          >
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>

        {/* Add to Queue */}
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <Input
            placeholder="Paste YouTube link here"
            className="bg-gray-900 border-gray-700"
            onChange={(e) => setInputLink(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add to Queue
          </Button>
        </form>

        <div className="">
          {inputLink && inputLink.match(YT_REGEX) && (
            <Card className="bg-gray-900 border-gray-800 w-full h-[300px] md:h-[400px]">
              <CardContent className="p-4">
                <LiteYoutubeEmbed
                  id={inputLink.split("?v=")[1]}
                  title=""
                  webp
                  poster="maxresdefault" // use a sharper thumbnail
                  noCookie
                  aspectHeight={9}
                  aspectWidth={16}
                  wrapperClass="w-full h-full rounded-lg overflow-hidden"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Now Playing */}
        <Card className="bg-gray-900 border-0 h-[450px]">
          <CardHeader className="font-semibold text-lg">Now Playing</CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-gray-400  h-[calc(100%-3rem)]">
            {currentVideo ? (
              <div className="flex-1 w-full ">
                <Youtube
                  key={currentVideo.id}
                  videoId={currentVideo.extractedId}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 1,
                      re: 0,
                      modestbranding: 1,
                    },
                  }}
                  onEnd={playNext}
                  className="w-full h-full"
                />
                <p>{currentVideo.title}</p>
              </div>
            ) : (
              <p className="text-center py-8 text-gray-400 ">
                No video playing
              </p>
            )}
          </CardContent>
        </Card>

        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={playNext}
        >
          ▶ Play Next
        </Button>

        {/* Upcoming Songs */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-3">Upcoming Songs</h2>

          {queue.map((video) => (
            <Card key={video.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 flex items-center space-x-4">
                <img
                  src={video.smallImg}
                  alt="LoadingImg..."
                  className="w-30 h-20 object-cover rounded"
                />

                <div>
                  <h3 className="font-semibold text-white">{video.title}</h3>
                  {/* <h1>{video.haveUpvoted}</h1> */}

                  <div className="flex items-center space-x-2 mt-2 ">
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      onClick={() =>
                        handleVote(video.id, video.haveUpvoted ? false : true)
                      }
                      className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                    >
                      {video.haveUpvoted ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )}
                      <span className="text-white">{video.upvotes}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
