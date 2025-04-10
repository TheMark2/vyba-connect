
import React, { useEffect, useState, useRef } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { MusicPreview } from "../types";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
  DialogDescription
} from "@/components/ui/dialog";

interface FullscreenPlayerProps {
  preview: MusicPreview;
  onClose: () => void;
  isOpen: boolean;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

const FullscreenPlayer = ({ 
  preview, 
  onClose, 
  isOpen,
  currentTime: externalCurrentTime,
  onTimeUpdate,
  audioRef
}: FullscreenPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(externalCurrentTime || 0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isUsingExternalAudio, setIsUsingExternalAudio] = useState(!!audioRef);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // Para formato de tiempo
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Sincronizar con el audio externo
  useEffect(() => {
    if (audioRef?.current && isOpen) {
      // Actualizar estado según audio externo
      if (externalCurrentTime !== undefined) {
        setCurrentTime(externalCurrentTime);
        
        // Sincronizar video con audio
        if (videoRef.current && Math.abs(videoRef.current.currentTime - externalCurrentTime) > 0.5) {
          videoRef.current.currentTime = externalCurrentTime;
        }
      }
      
      // Estado de reproducción
      setIsPlaying(!audioRef.current.paused);
    }
  }, [externalCurrentTime, audioRef, isOpen]);
  
  // Configurar video al abrir el diálogo
  useEffect(() => {
    if (!videoRef.current || !isOpen) return;
    
    const video = videoRef.current;
    
    // Configurar metadatos
    const handleMetadata = () => {
      setDuration(video.duration);
    };
    
    video.addEventListener('loadedmetadata', handleMetadata);
    
    // Con audio externo
    if (isUsingExternalAudio) {
      video.muted = true;
      
      // Sincronizar con tiempo inicial del audio
      if (audioRef?.current) {
        video.currentTime = audioRef.current.currentTime;
        
        if (!audioRef.current.paused) {
          video.play().catch(e => console.error("Error reproduciendo video en fullscreen:", e));
        }
      }
    } 
    // Sin audio externo, usar el video directamente
    else {
      video.muted = isMuted;
      
      video.addEventListener('timeupdate', () => {
        setCurrentTime(video.currentTime);
      });
      
      video.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      // Solo reproducir si no estamos usando audio externo
      if (isPlaying) {
        video.play().catch(e => console.error("Error reproduciendo video:", e));
      }
    }
    
    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('timeupdate', () => {});
      video.removeEventListener('ended', () => {});
    };
  }, [isOpen, isUsingExternalAudio, isPlaying, isMuted, audioRef]);
  
  // Controlar reproducción
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isUsingExternalAudio && audioRef?.current) {
      // Usar el audio externo
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Error reproduciendo audio:", e));
      }
    } else {
      // Control directo del video
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.error("Error reproduciendo video:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Control de silencio
  const toggleMute = () => {
    if (isUsingExternalAudio && audioRef?.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  // Cambiar posición de reproducción
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    if (isUsingExternalAudio && audioRef?.current) {
      // Actualizar audio externo
      audioRef.current.currentTime = newTime;
      if (onTimeUpdate) {
        onTimeUpdate(newTime);
      }
    } else if (videoRef.current) {
      // Actualizar video
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // Control con slider
  const handleSliderChange = (values: number[]) => {
    const newTime = (values[0] / 100) * duration;
    
    if (isUsingExternalAudio && audioRef?.current) {
      audioRef.current.currentTime = newTime;
      if (onTimeUpdate) {
        onTimeUpdate(newTime);
      }
    } else if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/95" />
        <DialogContent className="max-w-full w-full h-full max-h-full p-0 border-none bg-transparent">
          <DialogTitle className="sr-only">Reproductor de video</DialogTitle>
          <DialogDescription className="sr-only">Reproductor de video a pantalla completa</DialogDescription>
          
          <div className="fixed inset-0 flex flex-col">
            {/* Contenedor de video */}
            <div className="relative flex-grow flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                src={preview.videoUrl}
                className="max-h-full max-w-full"
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                muted={isUsingExternalAudio || isMuted}
              />
            </div>
            
            {/* Controles superpuestos */}
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
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default FullscreenPlayer;
