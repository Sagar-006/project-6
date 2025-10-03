"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

interface Video {
  id:string;
  title:string;
  upvotes:number;
  downvotes:number;
}
export default function StreamView() {
  const [inputLink,setInputLink] = useState("");
  const [queue,setQueue] = useState<Video[]>([
    { id: '1', title: "Awesome Song 1", upvotes: 5, downvotes: 1 },
    { id: '2', title: "Cool Music Video", upvotes: 3, downvotes: 0 },
    { id: '3', title: "Top Hit 2023", upvotes: 2, downvotes: 1 },
  ]);

  const [currentVideo,setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    refreshStreams
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

  return (
    <form className="min-h-screen bg-black text-white p-6">
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
        <div className="flex gap-2">
          <Input
            placeholder="Paste YouTube link here"
            className="bg-gray-900 border-gray-700"
            onChange={(e) => setInputLink(e.target.value)}
          />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Add to Queue
          </Button>
        </div>

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
        <div>
          <h2 className="text-lg font-semibold mb-3">Upcoming Songs</h2>
          <div className="space-y-3">
            {songs.map((song) => (
              <Card key={song.id} className="bg-gray-900 border-0">
                <CardContent className="flex justify-between items-center p-4">
                  <span className="font-medium">{song.title}</span>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <ThumbsUp className="w-4 h-4" /> {song.up}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <ThumbsDown className="w-4 h-4" /> {song.down}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
