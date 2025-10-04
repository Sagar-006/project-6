"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import axios from 'axios';


interface Video {
  id:string;
  title:string;
  upvotes:number;
  downvotes:number;
}

const REFRESH_INTERVAL_MS = 10 * 1000;
export default function StreamView() {
  const [inputLink,setInputLink] = useState("");
  const [queue,setQueue] = useState<Video[]>([
    { id: '1', title: "Awesome Song 1", upvotes: 5, downvotes: 1 },
    { id: '2', title: "Cool Music Video", upvotes: 3, downvotes: 0 },
    { id: '3', title: "Top Hit 2023", upvotes: 2, downvotes: 1 },
  ]);

  const [currentVideo,setCurrentVideo] = useState<Video | null>(null);

  async function refreshStreams(){
    const res = await axios.get(`/api/streams/my`,{
      withCredentials:true
    });
    console.log(res)
  }

  useEffect(() => {
    refreshStreams();
    const Interval = setInterval(() => {
      
    },REFRESH_INTERVAL_MS)
  },[])

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();

    const newVideo:Video = {
      id:String(queue.length + 1),
      title:`New Song ${queue.length + 1}`,
      upvotes:0,
      downvotes:0,
    }
    setQueue([...queue,newVideo])
    setInputLink('')
  }

  const handleVote = (id:string,isUpvote:boolean) => {
    setQueue(queue.map(video => 
      video.id === id ? {
        ...video,
        upvotes:isUpvote ? video.upvotes + 1 : video.upvotes,
      }
      : video
    ).sort((a,b)=> (b.upvotes) - (a.upvotes)))

    axios.post('/api/streams/upvote',{
      data:{
        userId:"abc",
        streamId:id,

      }
    })
  }

  const playNext = () => {
    
  } 
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

        {/* Now Playing */}
        <Card className="bg-gray-900 border-0">
          <CardHeader className="font-semibold text-lg">Now Playing</CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-gray-400 h-32">
            No video playing
          </CardContent>
        </Card>

        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
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
                  <div className="flex items-center space-x-2 mt-2 ">
                    <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => handleVote(video.id,true)}
                    className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                    >
                      <ThumbsUp className="h-4 w-4"/>
                      <span>{video.upvotes}</span>

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
