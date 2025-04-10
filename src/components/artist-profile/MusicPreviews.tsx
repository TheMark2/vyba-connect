
import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { toast } from "sonner";
import { MusicPreview } from "./music-previews/types";
import VideoPreviewCard from "./music-previews/VideoPreviewCard";
import ImagePreviewCard from "./music-previews/ImagePreviewCard";
import NoImagePreviewCard from "./music-previews/NoImagePreviewCard";
import { useCarouselLogic } from "./music-previews/useCarouselLogic";

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
  const { useCarousel, isNavbarVisible, getCardWidth } = useCarouselLogic(previews.length);

  const handlePlayPause = (preview: MusicPreview) => {
    console.log("Intentando reproducir:", preview);
    
    if (!preview.audioUrl) {
      console.log(`No hay URL de audio para: ${preview.title}`);
      toast.error("No hay audio disponible para esta pista");
      return;
    }

    console.log("URL de audio:", preview.audioUrl);

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
        
        audioRef.current.src = preview.audioUrl;
        console.log("URL asignada:", audioRef.current.src);
        audioRef.current.crossOrigin = "anonymous";
        audioRef.current.load();
        
        setTimeout(() => {
          if (loadingAudio === preview.title) {
            console.warn("Timeout de carga de audio");
            setLoadingAudio(null);
            handlePlaybackError(preview);
          }
        }, 10000);
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

  const renderPreviewCard = (preview: MusicPreview, index: number) => {
    if (preview.videoUrl && preview.hasVideo) {
      return (
        <VideoPreviewCard
          key={index}
          preview={preview}
          artistName={artistName}
          isPlaying={currentlyPlaying === preview.title}
          isLoading={loadingAudio === preview.title}
          onPlayPause={() => handlePlayPause(preview)}
        />
      );
    } else if (preview.image) {
      return (
        <ImagePreviewCard
          key={index}
          preview={preview}
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
          preview={preview}
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
