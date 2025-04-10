
import React, { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { toast } from "sonner";
import { MusicPreview } from "./types";
import VideoPreviewCard from "./music-previews/VideoPreviewCard";
import ImagePreviewCard from "./music-previews/ImagePreviewCard";
import NoImagePreviewCard from "./music-previews/NoImagePreviewCard";
import { useCarouselLogic } from "./music-previews/useCarouselLogic";
import { formatTime } from "@/lib/utils";

interface MusicPreviewsProps {
  previews: MusicPreview[];
  artistName: string;
  onPlaybackState?: (preview: MusicPreview, isPlaying: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicPreviews = ({
  previews,
  artistName,
  onPlaybackState,
  audioRef
}: MusicPreviewsProps) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const [durationsDetected, setDurationsDetected] = useState<{[key: string]: string}>({});
  const { useCarousel, isNavbarVisible, getCardWidth } = useCarouselLogic(previews.length);

  // Efecto para detectar las duraciones reales de los archivos de audio/video
  useEffect(() => {
    // Detectar duraciones solo una vez
    if (Object.keys(durationsDetected).length > 0) return;
    
    const detectDurations = async () => {
      const newDurations: {[key: string]: string} = {};
      
      // Iterar por cada preview y detectar su duración
      for (const preview of previews) {
        // Si es un video local (no YouTube), usar un elemento de video para detectar la duración
        if (preview.hasVideo && preview.videoUrl && 
            !preview.videoUrl.includes('youtube.com') && 
            !preview.videoUrl.includes('youtu.be')) {
          try {
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            // Crear una promesa para manejar la carga del metadata
            const loadPromise = new Promise<number>((resolve, reject) => {
              video.onloadedmetadata = () => {
                if (!isNaN(video.duration) && isFinite(video.duration)) {
                  resolve(video.duration);
                } else {
                  reject(new Error("Invalid duration"));
                }
              };
              
              video.onerror = () => {
                reject(new Error(`Error loading video: ${preview.videoUrl}`));
              };
              
              // Timeout para evitar esperas infinitas
              setTimeout(() => reject(new Error("Timeout")), 5000);
            });
            
            // Asignar la fuente del video e iniciar la carga
            video.src = preview.videoUrl;
            video.crossOrigin = "anonymous";
            
            // Esperar a que se cargue el metadata
            const duration = await loadPromise;
            newDurations[preview.title] = formatTime(duration);
            console.log(`Duración detectada para ${preview.title}: ${formatTime(duration)}`);
          } catch (err) {
            console.error(`No se pudo detectar la duración para ${preview.title}:`, err);
          }
        } 
        // Si hay audioUrl, detectar la duración usando un elemento de audio
        else if (preview.audioUrl) {
          try {
            const audio = document.createElement('audio');
            audio.preload = 'metadata';
            
            const loadPromise = new Promise<number>((resolve, reject) => {
              audio.onloadedmetadata = () => {
                if (!isNaN(audio.duration) && isFinite(audio.duration)) {
                  resolve(audio.duration);
                } else {
                  reject(new Error("Invalid duration"));
                }
              };
              
              audio.onerror = () => {
                reject(new Error(`Error loading audio: ${preview.audioUrl}`));
              };
              
              setTimeout(() => reject(new Error("Timeout")), 5000);
            });
            
            audio.src = preview.audioUrl;
            audio.crossOrigin = "anonymous";
            
            const duration = await loadPromise;
            newDurations[preview.title] = formatTime(duration);
            console.log(`Duración detectada para ${preview.title}: ${formatTime(duration)}`);
          } catch (err) {
            console.error(`No se pudo detectar la duración para ${preview.title}:`, err);
          }
        }
      }
      
      setDurationsDetected(newDurations);
    };
    
    detectDurations();
  }, [previews]);
  
  const handlePlayPause = (preview: MusicPreview) => {
    console.log("Intentando reproducir:", preview);
    
    // Si ya está reproduciéndose esta pista, pausarla
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
    
    // Detener la reproducción actual
    if (audioRef.current) {
      console.log("Reproduciendo nuevo audio/video");
      audioRef.current.pause();
      
      // Determinar qué fuente de audio usar
      // SIEMPRE usar el video como fuente de audio si está disponible para mejorar la calidad
      let audioSource = preview.hasVideo && preview.videoUrl && 
                        !preview.videoUrl.includes('youtube.com') && 
                        !preview.videoUrl.includes('youtu.be') 
                        ? preview.videoUrl
                        : preview.audioUrl;
      
      // Registrar la fuente que estamos usando
      if (preview.hasVideo && preview.videoUrl && 
          !preview.videoUrl.includes('youtube.com') && 
          !preview.videoUrl.includes('youtu.be')) {
        console.log("Usando audio del video:", preview.videoUrl);
      }
      
      // Si no hay fuente de audio disponible
      if (!audioSource) {
        console.log(`No hay URL de audio para: ${preview.title}`);
        toast.error("No hay audio disponible para esta pista");
        setLoadingAudio(null);
        return;
      }
      
      try {
        // Limpiar eventos anteriores
        audioRef.current.oncanplaythrough = null;
        audioRef.current.onerror = null;
        audioRef.current.onloadedmetadata = null;
        audioRef.current.onended = null;
        
        // Configurar eventos para el audio
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
        
        // Configurar y cargar el audio
        audioRef.current.src = audioSource;
        audioRef.current.crossOrigin = "anonymous";
        audioRef.current.volume = 1.0;
        audioRef.current.loop = false; // Nunca reproducir en bucle
        audioRef.current.load();
        
        // Timeout para manejar problemas de carga
        const timeoutId = setTimeout(() => {
          if (loadingAudio === preview.title) {
            console.warn("Timeout de carga de audio");
            setLoadingAudio(null);
            handlePlaybackError(preview);
          }
        }, 8000);
        
        return () => clearTimeout(timeoutId);
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

  // Función para obtener duración detectada o la proporcionada
  const getPreviewWithCorrectDuration = (preview: MusicPreview): MusicPreview => {
    if (durationsDetected[preview.title]) {
      return {
        ...preview,
        duration: durationsDetected[preview.title]
      };
    }
    return preview;
  };

  const renderPreviewCard = (preview: MusicPreview, index: number) => {
    // Usar la duración detectada si está disponible
    const previewWithCorrectDuration = getPreviewWithCorrectDuration(preview);
    
    if (preview.videoUrl && preview.hasVideo) {
      return (
        <VideoPreviewCard
          key={index}
          preview={previewWithCorrectDuration}
          artistName={artistName}
          isPlaying={currentlyPlaying === preview.title}
          isLoading={loadingAudio === preview.title}
          onPlayPause={() => handlePlayPause(preview)}
          audioRef={audioRef}
        />
      );
    } else if (preview.image) {
      return (
        <ImagePreviewCard
          key={index}
          preview={previewWithCorrectDuration}
          artistName={artistName}
          isPlaying={currentlyPlaying === preview.title}
          isLoading={loadingAudio === preview.title}
          onPlayPause={() => handlePlayPause(preview)}
        />
      );
    } else {
      return (
        <NoImagePreviewCard
          key={index}
          preview={previewWithCorrectDuration}
          artistName={artistName}
          isPlaying={currentlyPlaying === preview.title}
          isLoading={loadingAudio === preview.title}
          onPlayPause={() => handlePlayPause(preview)}
        />
      );
    }
  };

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
                    className="pl-4"
                    style={{
                      width: getCardWidth(),
                      flex: `0 0 ${getCardWidth()}`
                    }}
                  >
                    {renderPreviewCard(preview, index)}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div
              className={`flex overflow-x-auto space-x-4 pb-4 ${
                isNavbarVisible ? "hidden" : ""
              }`}
            >
              {previews.map((preview, index) => (
                <div key={index} style={{ width: getCardWidth(), flex: `0 0 ${getCardWidth()}` }}>
                  {renderPreviewCard(preview, index)}
                </div>
              ))}
            </div>
          )}

          {!useCarousel && isNavbarVisible && (
            <div className="grid gap-6" style={{ 
              gridTemplateColumns: `repeat(auto-fill, minmax(${getCardWidth()}, 1fr))` 
            }}>
              {previews.map((preview, index) => (
                <div key={index}>
                  {renderPreviewCard(preview, index)}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MusicPreviews;
