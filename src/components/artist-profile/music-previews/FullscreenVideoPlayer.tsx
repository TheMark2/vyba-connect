
import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { MusicPreview } from "./types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";

interface FullscreenVideoPlayerProps {
  preview: MusicPreview;
  onClose: () => void;
}

const FullscreenVideoPlayer = ({ preview, onClose }: FullscreenVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Configurar el video cuando el componente se monta
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Cargar metadatos para obtener la duración
      video.onloadedmetadata = () => {
        setDuration(video.duration);
      };
      
      // Actualizar tiempo actual durante la reproducción
      video.ontimeupdate = () => {
        setCurrentTime(video.currentTime);
      };
      
      // Reiniciar estado al finalizar
      video.onended = () => {
        setIsPlaying(false);
      };
      
      // Iniciar reproducción automáticamente al abrir
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Error al reproducir video:", err);
      });
    }
    
    // Limpiar eventos al desmontar
    return () => {
      if (videoRef.current) {
        const video = videoRef.current;
        video.pause();
        video.onloadedmetadata = null;
        video.ontimeupdate = null;
        video.onended = null;
      }
    };
  }, []);
  
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.error("Error al reproducir video:", err);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    // Actualizar tiempo del video
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Video container */}
      <div className="relative flex-grow flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src={preview.videoUrl}
          className="max-h-full max-w-full"
          playsInline
          preload="auto"
          crossOrigin="anonymous"
        />
      </div>
      
      {/* Controls overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/0 via-black/0 to-black/70 opacity-100 transition-opacity duration-300 hover:opacity-100">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white bg-black/30 hover:bg-black/50 rounded-full"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-white mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <div 
            ref={progressBarRef}
            className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-4"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-white rounded-full" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">{preview.title}</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white bg-white/10 hover:bg-white/20 rounded-full"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenVideoPlayer;
