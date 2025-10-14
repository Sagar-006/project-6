"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Youtube, { YouTubeProps } from "react-youtube";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";
import axios from "axios";
import LiteYoutubeEmbed from "react-lite-youtube-embed";
import { YT_REGEX } from "@/lib/utils";
import { toast, ToastContainer } from 'react-toastify';

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
  const [loading,setLoading] = useState<boolean>(false);

  async function refreshStreams() {
    const res = await axios.get(`/api/streams/?creatorId=${userId}`, {
      withCredentials: true,
    });
    console.log("this is incide refreshStreams function", res.data);
    const json = res.data.streams;
    setQueue(json);
  }

  useEffect(() => {
    refreshStreams();
    // getStreams();
    const Interval = setInterval(() => {
      refreshStreams()
      // getStreams()
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(Interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    if (!inputLink.trim()) {
      toast.error("Please enter a YouTube link");
      return;
    }
    try{
      const res = await axios.post(
        `/api/streams`,
        { creatorId: userId, url: inputLink },
        { withCredentials: true }
      );
      console.log("this is inside Post streams method", res);
      // toast.error(res)

      setQueue([...queue, await res.data.stream]);
      setLoading(false);
      setInputLink("");

      toast.success('Video added to queue');
    }catch(error){
      console.error('API error')
      // toast.error(error.response?.data.message || 'something went wrong')
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
        `/api/streams/${isUpvote ? "upvote" : "downvote"}`,
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
    axios.delete(`/api/streams/${currentVideo?.id}`, {
      withCredentials: true,
    });
    if (queue.length > 0) {
      setCurrentVideo(queue[0]);
      setQueue(queue.slice(1));
    }

  };

  const handleShare = () => {
    const shareableLink = `${window.location.hostname}/creator/${userId}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast.success('Link copied to clipboard!')
    },(err) => {
      console.log(err);
      toast.error('Failed to copy link,please try again')
    })
  }

  console.log(queue);

  const embedurl = `https://www.youtube.com/embed/${currentVideo?.extractedId}?autoplay=1`;
  return (
    <div className="min-h-screen flex flex-col bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6 p-4 w-full ">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Song Voting Queue</h1>
          <Button
            onClick={handleShare}
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
            disabled={loading}
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? "Loading..." : "Add to Queue"}
          </Button>
        </form>

        <div className="">
          {inputLink && inputLink.match(YT_REGEX) && !loading && (
            <Card className="bg-gray-900 border-gray-800 ">
              <CardContent className="p-4">
                <LiteYoutubeEmbed title="" id={inputLink.split("?v=")[1]} />
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
                  src={
                    video.smallImg ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl3GPtE-cUcwF8cEk5pohVVMrjl86d04BoEg&s"
                  }
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
      <ToastContainer />
    </div>
  );
}
