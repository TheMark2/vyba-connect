
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { PreviewCardProps } from "./types";
import { useVideoLogic } from "./video-components/useVideoLogic";
import VideoThumbnail from "./video-components/VideoThumbnail";
import VideoControls from "./video-components/VideoControls";
import FullscreenPlayer from "./video-components/FullscreenPlayer";

const VideoPreviewCard = ({
  preview,
  artistName,
  isPlaying,
  isLoading = false,
  onPlayPause,
  audioRef
}: PreviewCardProps) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  const {
    videoRef,
    isVideoPlaying,
    videoError,
    currentTime,
    duration,
    isYoutubeVideo,
    isLocalVideo,
    youtubeEmbedUrl,
    handleRetry,
    handleMouseEnter,
    handleMouseLeave,
    setCurrentTime
  } = useVideoLogic(preview, isPlaying, audioRef);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayPause();
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isYoutubeVideo) {
      // Para YouTube, abrimos en una nueva pestaña
      if (preview.videoUrl) {
        window.open(preview.videoUrl, '_blank');
      }
    } else if (isLocalVideo && !videoError) {
      // Para videos locales, mostramos el reproductor a pantalla completa
      setShowFullscreen(true);
    }
  };

  // Para actualizar el tiempo cuando cambia en el reproductor a pantalla completa
  const handleTimeUpdate = (time: number) => {
    if (audioRef?.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  return (
    <>
      <Card 
        className="overflow-hidden rounded-3xl relative group cursor-pointer border-none" 
        onClick={onPlayPause}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-[4/5]">
          <VideoThumbnail 
            preview={preview}
            isPlaying={isPlaying}
            isVideoPlaying={isVideoPlaying}
            videoError={videoError}
            videoRef={videoRef}
            onRetry={handleRetry}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            youtubeEmbedUrl={youtubeEmbedUrl}
            isYoutubeVideo={isYoutubeVideo}
          />
          
          <VideoControls 
            title={preview.title}
            artistName={artistName}
            duration={preview.duration}
            isPlaying={isPlaying}
            isLoading={isLoading}
            isVideoPlaying={isVideoPlaying}
            onPlay={handlePlay}
            onExpand={handleExpand}
          />
        </div>
      </Card>
      
      {showFullscreen && (
        <FullscreenPlayer 
          preview={preview}
          onClose={() => setShowFullscreen(false)}
          isOpen={showFullscreen}
          currentTime={currentTime}
          onTimeUpdate={handleTimeUpdate}
          audioRef={audioRef}
        />
      )}
    </>
  );
};

export default VideoPreviewCard;
