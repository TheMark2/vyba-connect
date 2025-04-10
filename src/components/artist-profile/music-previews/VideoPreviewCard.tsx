
import React, { useRef, useState, useEffect } from "react";
import { Video, Play, Expand, Pause, FileAudio, VideoOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PreviewCardProps } from "./types";

const VideoPreviewCard = ({
  preview,
  artistName,
  isPlaying,
  isLoading,
  onPlayPause
}: PreviewCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  useEffect(() => {
    if (videoRef.current) {
      // Configurar el video para bucle de los primeros 10 segundos
      const handleMetadata = () => {
        console.log("Video metadata loaded");
        // Limitar a 10 segundos o a la duración del video si es menor
        const clipDuration = Math.min(10, videoRef.current?.duration || 10);
        
        const handleTimeUpdate = () => {
          if (videoRef.current && videoRef.current.currentTime > clipDuration) {
            videoRef.current.currentTime = 0; // Reiniciar al principio cuando llega a 10s
          }
        };
        
        videoRef.current?.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
          videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
        };
      };
      
      const handleError = () => {
        console.error("Error cargando el video:", preview.videoUrl);
        setVideoError(true);
      };
      
      videoRef.current.addEventListener('loadedmetadata', handleMetadata);
      videoRef.current.addEventListener('error', handleError);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadedmetadata', handleMetadata);
          videoRef.current.removeEventListener('error', handleError);
        }
      };
    }
  }, [preview.videoUrl]);
  
  const handleMouseEnter = () => {
    if (videoRef.current && !videoError) {
      videoRef.current.currentTime = 0;
      
      // Usar muted para permitir la reproducción automática
      videoRef.current.muted = true;
      
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Error al reproducir el video automáticamente:", err);
        });
      }
      setIsVideoPlaying(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
    }
  };
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayPause();
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Expandiendo video: ${preview.title}`);
  };

  const handleCardClick = () => {
    onPlayPause();
  };

  return (
    <Card 
      className="overflow-hidden rounded-3xl relative group cursor-pointer border-none" 
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[4/5]">
        {videoError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
            <VideoOff className="h-16 w-16 text-gray-400" />
          </div>
        ) : (
          <video 
            ref={videoRef}
            src={preview.videoUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        )}
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60 pointer-events-none transition-opacity duration-300 ${isVideoPlaying ? 'opacity-30' : 'group-hover:opacity-30'}`}></div>
        
        <div className="absolute top-5 left-5 flex gap-2">
          <Badge className="bg-white text-black font-medium px-4 py-2 rounded-full">
            <Video className="w-4 h-4 mr-1" />
            Video
          </Badge>
          
          {preview.audioUrl && 
            <Badge className="bg-white text-black font-medium px-4 py-2 rounded-full">
              <FileAudio className="w-4 h-4 mr-1" />
              Audio
            </Badge>
          }
        </div>
        
        <Badge 
          className="absolute top-5 right-5 bg-white text-black font-medium px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          onClick={handleExpand}
        >
          <Expand className="w-4 h-4 mr-1" />
          Expandir
        </Badge>
        
        <div className="absolute bottom-0 left-0 right-0 p-7 text-white transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-xl font-black line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-white/80 mb-5">{artistName}</p>
        </div>

        <Button 
          variant="secondary" 
          size="icon" 
          className={`absolute bottom-7 left-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10 w-10 bg-white hover:bg-white/90 text-black ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
          onClick={handlePlay}
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
          <span className="text-sm font-medium text-white bg-black/50 px-2 py-1 rounded-md">{preview.duration}</span>
        </div>
      </div>
    </Card>
  );
};

export default VideoPreviewCard;
