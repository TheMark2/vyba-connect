
import React, { useRef, useState, useEffect } from "react";
import { Video, Play, Expand, Pause, FileAudio, VideoOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PreviewCardProps } from "./types";
import { toast } from "sonner";
import Image from "@/components/ui/image";
import FullscreenVideoPlayer from "./FullscreenVideoPlayer";
import { formatTime } from "@/lib/utils";

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
  const [retryCount, setRetryCount] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Verificar si es un video de YouTube o un video local/web
  const isYoutubeVideo = preview.videoUrl?.includes('youtube.com') || preview.videoUrl?.includes('youtu.be');
  const isLocalVideo = !isYoutubeVideo && preview.videoUrl !== undefined;
  
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Patrones para extraer el ID de YouTube de diferentes formatos de URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    // Si hay coincidencia y el ID tiene 11 caracteres (ID estándar de YouTube)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=0&controls=0&showinfo=0&rel=0`;
    }
    
    return url; // Devolver la URL original si no es de YouTube
  };
  
  const youtubeEmbedUrl = isYoutubeVideo ? getYoutubeEmbedUrl(preview.videoUrl || '') : '';
  
  useEffect(() => {
    // Si es un video de YouTube, no necesitamos manejar el video nativo
    if (isYoutubeVideo) {
      setVideoError(false);
      return;
    }
    
    const loadVideo = () => {
      if (videoRef.current) {
        // Limpiar eventos previos
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onerror = null;
        
        // Configurar el video
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded:", preview.title);
          setVideoError(false);
          
          // Actualizar la duración del video si está disponible
          if (videoRef.current && !isNaN(videoRef.current.duration)) {
            // Solo actualizar en consola para verificar, no modificamos el objeto preview directamente
            console.log(`Duración real del video ${preview.title}: ${formatTime(videoRef.current.duration)}`);
          }
        };
        
        videoRef.current.onerror = (e) => {
          console.error("Error cargando el video:", preview.videoUrl, e);
          setVideoError(true);
        };
      }
    };
    
    loadVideo();
    
    return () => {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onerror = null;
        videoRef.current.ontimeupdate = null;
      }
    };
  }, [preview.videoUrl, isYoutubeVideo, preview.title]);
  
  // Efecto para sincronizar el estado de reproducción con isPlaying
  useEffect(() => {
    // No hacemos nada si es un video de YouTube o hay error
    if (isYoutubeVideo || videoError) return;
    
    if (videoRef.current) {
      if (isPlaying) {
        // Sincronizar visualmente el video con el audio principal (muted)
        videoRef.current.muted = true;
        
        try {
          // Solo sincronizar el video (no el audio)
          const syncPromise = videoRef.current.play();
          if (syncPromise !== undefined) {
            syncPromise.catch(error => {
              console.error("Error al sincronizar video:", error);
            });
          }
          
          // Actualizamos el tiempo actual cuando cambia en el video
          videoRef.current.ontimeupdate = () => {
            setCurrentTime(videoRef.current!.currentTime);
          };
        } catch (e) {
          console.error("Error al sincronizar el video:", e);
        }
      } else {
        videoRef.current.pause();
        videoRef.current.ontimeupdate = null;
      }
    }
    
    // Si no está reproduciéndose como audio principal,
    // nos aseguramos de que el video esté pausado y en su posición inicial
    if (!isPlaying && videoRef.current && !isYoutubeVideo && !videoError) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
      setCurrentTime(0);
    }
  }, [isPlaying, isYoutubeVideo, videoError]);
  
  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetryCount(prev => prev + 1);
    setVideoError(false);
    toast.info("Reintentando cargar el video");
    if (videoRef.current) {
      // Forzar recarga del video
      const currentSrc = videoRef.current.src;
      videoRef.current.src = '';
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.src = currentSrc || preview.videoUrl || '';
          videoRef.current.load();
        }
      }, 100);
    }
  };
  
  const handleMouseEnter = () => {
    // No activar la vista previa si está reproduciéndose como audio principal
    // o si es un video de YouTube o hay error
    if (isYoutubeVideo || videoError || isPlaying) return;
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      
      // Usar muted para permitir la reproducción automática
      videoRef.current.muted = true;
      
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // No mostrar este error en consola ya que es esperado en algunos navegadores
          setIsVideoPlaying(false);
        });
      }
      setIsVideoPlaying(true);
    }
  };
  
  const handleMouseLeave = () => {
    // No detener en hover si está sonando como audio principal
    if (isYoutubeVideo || videoError || isPlaying) return;
    
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
    if (isYoutubeVideo) {
      // Para YouTube, abrimos en una nueva pestaña
      if (preview.videoUrl) {
        window.open(preview.videoUrl, '_blank');
      }
    } else if (isLocalVideo && !videoError) {
      // Para videos locales, mostramos el reproductor a pantalla completa con Dialog
      setShowFullscreen(true);
    } else {
      toast.error("No se puede expandir este video", {
        description: "El video no está disponible o tiene un error."
      });
    }
  };

  const handleCardClick = () => {
    onPlayPause();
  };

  return (
    <>
      <Card 
        className="overflow-hidden rounded-3xl relative group cursor-pointer border-none" 
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-[4/5]">
          {isYoutubeVideo ? (
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
          ) : videoError ? (
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
                      onClick={handleRetry}
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
                    onClick={handleRetry}
                    className="mt-2"
                  >
                    Reintentar
                  </Button>
                </>
              )}
            </div>
          ) : (
            <video 
              ref={videoRef}
              src={preview.videoUrl}
              className="w-full h-full object-cover"
              muted={true} // Siempre silenciado porque el audio lo maneja AudioPlayer
              playsInline
              preload="metadata"
              poster={preview.image}
              crossOrigin="anonymous"
              loop={false}
            />
          )}
          
          <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60 pointer-events-none transition-opacity duration-300 ${isVideoPlaying || isPlaying ? 'opacity-30' : 'group-hover:opacity-30'}`}></div>
          
          <div className="absolute top-5 left-5 flex gap-2">
            <Badge className="bg-white text-black font-medium px-4 py-2 rounded-full">
              <Video className="w-4 h-4 mr-1" />
              Video
            </Badge>
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
      
      {showFullscreen && (
        <FullscreenVideoPlayer 
          preview={preview}
          onClose={() => setShowFullscreen(false)}
          isOpen={showFullscreen}
          currentTime={currentTime}
          onTimeUpdate={(time) => setCurrentTime(time)}
        />
      )}
    </>
  );
};

export default VideoPreviewCard;
