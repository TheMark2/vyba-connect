
import React from "react";
import { VideoOff } from "lucide-react";
import { MusicPreview } from "../types";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";

interface VideoThumbnailProps {
  preview: MusicPreview;
  isPlaying: boolean;
  isVideoPlaying: boolean;
  videoError: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  onRetry: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  youtubeEmbedUrl?: string;
  isYoutubeVideo: boolean;
}

const VideoThumbnail = ({
  preview,
  isPlaying,
  isVideoPlaying,
  videoError,
  videoRef,
  onRetry,
  onMouseEnter,
  onMouseLeave,
  youtubeEmbedUrl,
  isYoutubeVideo
}: VideoThumbnailProps) => {
  
  if (isYoutubeVideo) {
    return (
      <div className="w-full h-full">
        <iframe 
          className="w-full h-full object-cover"
          src={youtubeEmbedUrl}
          title={preview.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  
  if (videoError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800">
        {preview.image ? (
          <div className="w-full h-full relative">
            <Image 
              src={preview.image} 
              alt={preview.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <VideoOff className="h-12 w-12 text-white mb-2" />
              <p className="text-sm text-white mb-2">Error al cargar el video</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="mt-2 bg-white/20 text-white hover:bg-white/30 border-white/40"
              >
                Reintentar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <VideoOff className="h-16 w-16 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Error al cargar el video</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-2"
            >
              Reintentar
            </Button>
          </>
        )}
      </div>
    );
  }
  
  return (
    <video 
      ref={videoRef}
      src={preview.videoUrl}
      className="w-full h-full object-cover"
      muted={true}
      playsInline
      preload="metadata"
      poster={preview.image}
      crossOrigin="anonymous"
      loop={true}
    />
  );
};

export default VideoThumbnail;
