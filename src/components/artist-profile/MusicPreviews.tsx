
import React, { useEffect, useState, useRef } from "react";
import { Video, Play, Pause, FileAudio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MusicPreview {
  title: string;
  duration: string;
  image?: string;
  hasVideo?: boolean;
  audioUrl?: string;
  videoUrl?: string;
}

interface MusicPreviewsProps {
  previews: MusicPreview[];
  artistName: string;
  onPlaybackState?: (preview: MusicPreview, isPlaying: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

// Videos disponibles en el proyecto con nombres simplificados
const LOCAL_VIDEOS = {
  badBunny: "/lovable-uploads/bad-bunny-moscow-mule.mp4",
  westcol: "/lovable-uploads/westcol-la-plena.mp4"
};

const MusicPreviews = ({
  previews,
  artistName,
  onPlaybackState,
  audioRef
}: MusicPreviewsProps) => {
  const isMobile = useIsMobile();
  const [useCarousel, setUseCarousel] = useState(isMobile || previews.length > 3);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);

  useEffect(() => {
    // Asignar videos locales a las previsualizaciones que tienen hasVideo=true
    previews.forEach((preview, index) => {
      if (preview.hasVideo && !preview.videoUrl) {
        // Alternar entre los dos videos disponibles
        preview.videoUrl = index % 2 === 0 ? LOCAL_VIDEOS.badBunny : LOCAL_VIDEOS.westcol;
      }
    });
  }, [previews]);

  const handlePlayPause = (preview: MusicPreview) => {
    console.log("Intentando reproducir:", preview);
    
    if (currentlyPlaying === preview.title) {
      if (audioRef.current) {
        console.log("Pausando audio");
        audioRef.current.pause();
        setCurrentlyPlaying(null);
        if (onPlaybackState) {
          onPlaybackState(preview, false);
        }
      }
      return;
    }
    
    setLoadingAudio(preview.title);
    
    if (preview.hasVideo && preview.videoUrl) {
      console.log("Usando audio del video:", preview.videoUrl);
      
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          
          // Limpiar listeners antiguos
          audioRef.current.oncanplaythrough = null;
          audioRef.current.onerror = null;
          audioRef.current.onloadedmetadata = null;
          audioRef.current.onended = null;
          
          // Configurar nueva fuente - asegurarse de que la URL esté codificada correctamente
          const encodedUrl = encodeURI(preview.videoUrl);
          audioRef.current.src = encodedUrl;
          audioRef.current.crossOrigin = "anonymous";
          
          audioRef.current.oncanplaythrough = () => {
            console.log("Audio del video listo para reproducir");
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => {
                  console.log("Reproducción del audio del video iniciada correctamente");
                  setCurrentlyPlaying(preview.title);
                  setLoadingAudio(null);
                  if (onPlaybackState) {
                    onPlaybackState(preview, true);
                  }
                })
                .catch(error => {
                  console.error("Error al reproducir audio del video:", error);
                  setLoadingAudio(null);
                  handlePlaybackError(preview);
                });
            }
          };
          
          audioRef.current.onerror = (e) => {
            console.error("Error en la carga del audio del video:", e);
            setLoadingAudio(null);
            handlePlaybackError(preview);
          };
          
          audioRef.current.load();
          
          setTimeout(() => {
            if (loadingAudio === preview.title) {
              audioRef.current?.play()
                .then(() => {
                  console.log("Reproducción forzada del audio iniciada correctamente");
                  setCurrentlyPlaying(preview.title);
                  setLoadingAudio(null);
                  if (onPlaybackState) {
                    onPlaybackState(preview, true);
                  }
                })
                .catch(error => {
                  console.error("Error en la reproducción forzada:", error);
                  setLoadingAudio(null);
                  handlePlaybackError(preview);
                });
            }
          }, 3000);
        }
      } catch (error) {
        console.error("Error al configurar el audio del video:", error);
        setLoadingAudio(null);
        handlePlaybackError(preview);
        
        if (preview.audioUrl) {
          console.log("Intentando reproducir audioUrl como fallback");
          playRegularAudio(preview);
        }
      }
    } else if (preview.audioUrl) {
      playRegularAudio(preview);
    } else {
      console.log(`No hay URL de audio para: ${preview.title}`);
      toast.error("No hay audio disponible para esta pista");
      setLoadingAudio(null);
    }
  };

  const playRegularAudio = (preview: MusicPreview) => {
    if (!preview.audioUrl) {
      console.log(`No hay URL de audio para: ${preview.title}`);
      toast.error("No hay audio disponible para esta pista");
      setLoadingAudio(null);
      return;
    }
    
    console.log("URL de audio:", preview.audioUrl);
    
    if (audioRef.current) {
      console.log("Reproduciendo nuevo audio");
      audioRef.current.pause();
      
      try {
        audioRef.current.oncanplaythrough = null;
        audioRef.current.onerror = null;
        audioRef.current.onloadedmetadata = null;
        audioRef.current.onended = null;
        
        audioRef.current.oncanplaythrough = () => {
          console.log("Audio listo para reproducir sin interrupciones");
          if (audioRef.current) {
            audioRef.current.play()
              .then(() => {
                console.log("Reproducción iniciada correctamente");
                setCurrentlyPlaying(preview.title);
                setLoadingAudio(null);
                if (onPlaybackState) {
                  onPlaybackState(preview, true);
                }
              })
              .catch(error => {
                console.error("Error al reproducir audio:", error);
                setLoadingAudio(null);
                handlePlaybackError(preview);
              });
          }
        };
        
        audioRef.current.onerror = (e) => {
          console.error("Error en la carga del audio:", e);
          setLoadingAudio(null);
          handlePlaybackError(preview);
        };
        
        audioRef.current.onloadedmetadata = () => {
          console.log("Metadatos de audio cargados");
        };
        
        audioRef.current.onended = () => {
          console.log("Audio finalizado");
          setCurrentlyPlaying(null);
          if (onPlaybackState) {
            onPlaybackState(preview, false);
          }
        };
        
        // Asegurarse de que la URL esté codificada correctamente
        const encodedUrl = encodeURI(preview.audioUrl);
        audioRef.current.crossOrigin = "anonymous";
        audioRef.current.src = encodedUrl;
        console.log("URL asignada:", audioRef.current.src);
        audioRef.current.load();
        
        setTimeout(() => {
          if (loadingAudio === preview.title) {
            audioRef.current?.play()
              .then(() => {
                console.log("Reproducción forzada iniciada correctamente");
                setCurrentlyPlaying(preview.title);
                setLoadingAudio(null);
                if (onPlaybackState) {
                  onPlaybackState(preview, true);
                }
              })
              .catch(error => {
                console.error("Error en la reproducción forzada:", error);
                setLoadingAudio(null);
                handlePlaybackError(preview);
              });
          }
        }, 3000);
      } catch (error) {
        console.error("Error al configurar el audio:", error);
        setLoadingAudio(null);
        handlePlaybackError(preview);
      }
    }
  };

  const handlePlaybackError = (preview: MusicPreview) => {
    toast.error("Error al reproducir el audio", {
      description: "Intente de nuevo o pruebe otra pista"
    });
    setCurrentlyPlaying(null);
    if (onPlaybackState) {
      onPlaybackState(preview, false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setUseCarousel(true);
      } else if (window.innerWidth < 1024) {
        setUseCarousel(previews.length > 2);
      } else {
        setUseCarousel(previews.length > 3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [previews.length]);

  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-6">Preview</h2>
      
      {previews?.length > 0 && (
        <>
          {useCarousel ? (
            <Carousel
              opts={{
                align: "start",
                loop: false,
                containScroll: "trimSnaps"
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {previews.map((preview, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <PreviewCard 
                      preview={preview} 
                      isPlaying={currentlyPlaying === preview.title}
                      isLoading={loadingAudio === preview.title}
                      onPlayPause={() => handlePlayPause(preview)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <PreviewCard 
                  key={index}
                  preview={preview} 
                  isPlaying={currentlyPlaying === preview.title}
                  isLoading={loadingAudio === preview.title}
                  onPlayPause={() => handlePlayPause(preview)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const PreviewCard = ({
  preview,
  isPlaying,
  isLoading,
  onPlayPause
}: {
  preview: MusicPreview;
  isPlaying: boolean;
  isLoading?: boolean;
  onPlayPause: () => void;
}) => {
  // Imagen por defecto en caso de que no se proporcione
  const defaultImage = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070";
  
  return (
    <div className="space-y-2">
      {/* Contenedor principal de la imagen */}
      <div 
        className="relative overflow-hidden rounded-3xl aspect-square cursor-pointer"
        onClick={onPlayPause}
      >
        {/* Imagen de fondo */}
        <img 
          src={preview.image || defaultImage} 
          alt={preview.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Degradado de negro a transparente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Badge tipo blur en la parte superior */}
        <div className="absolute top-4 left-4">
          <div className="backdrop-blur-md bg-white/30 text-white px-3 py-1.5 rounded-full flex items-center">
            {preview.hasVideo ? (
              <>
                <Video className="w-4 h-4 mr-1.5" />
                <span className="text-sm font-medium">Video</span>
              </>
            ) : (
              <>
                <FileAudio className="w-4 h-4 mr-1.5" />
                <span className="text-sm font-medium">Audio</span>
              </>
            )}
          </div>
        </div>
        
        {/* Botón de play centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button 
            variant="outline"
            size="icon" 
            className="h-14 w-14 rounded-full bg-white hover:bg-white/90 border-0 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onPlayPause();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-6 w-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6 fill-black text-black" />
            ) : (
              <Play className="h-6 w-6 fill-black text-black ml-1" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Textos debajo de la tarjeta */}
      <div className="space-y-0.5 px-0.5">
        <h3 className="text-base font-medium line-clamp-1">{preview.title}</h3>
        <p className="text-sm font-normal text-[#C0C0C0]">{preview.duration}</p>
      </div>
    </div>
  );
};

export default MusicPreviews;
