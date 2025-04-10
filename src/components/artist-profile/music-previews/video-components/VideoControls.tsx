
import React from "react";
import { Video, Play, Expand, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VideoControlsProps {
  title: string;
  artistName: string;
  duration: string;
  isPlaying: boolean;
  isLoading: boolean;
  isVideoPlaying: boolean;
  onPlay: (e: React.MouseEvent) => void;
  onExpand: (e: React.MouseEvent) => void;
}

const VideoControls = ({
  title,
  artistName,
  duration,
  isPlaying,
  isLoading,
  isVideoPlaying,
  onPlay,
  onExpand
}: VideoControlsProps) => {
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60 pointer-events-none transition-opacity duration-300 ${isVideoPlaying || isPlaying ? 'opacity-30' : 'group-hover:opacity-30'}`}></div>
      
      <div className="absolute top-5 left-5 flex gap-2">
        <Badge className="bg-white text-black font-medium px-4 py-2 rounded-full">
          <Video className="w-4 h-4 mr-1" />
          Video
        </Badge>
      </div>
      
      <Badge 
        className="absolute top-5 right-5 bg-white text-black font-medium px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        onClick={onExpand}
      >
        <Expand className="w-4 h-4 mr-1" />
        Expandir
      </Badge>
      
      <div className="absolute bottom-0 left-0 right-0 p-7 text-white transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-xl font-black line-clamp-1">{title}</h3>
        <p className="text-sm text-white/80 mb-5">{artistName}</p>
      </div>

      <Button 
        variant="secondary" 
        size="icon" 
        className={`absolute bottom-7 left-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10 w-10 bg-white hover:bg-white/90 text-black ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
        onClick={onPlay}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        ) : isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>
      
      <div className="absolute bottom-7 right-7 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-sm font-medium text-white bg-black/50 px-2 py-1 rounded-md">{duration}</span>
      </div>
    </>
  );
};

export default VideoControls;
