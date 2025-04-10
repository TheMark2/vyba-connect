import React, { useEffect, useState, useRef } from "react";
import { Music, Video, Play, Expand, Pause, FileAudio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface MusicPreview {
  title: string;
  duration: string;
  image?: string;
  hasVideo?: boolean;
  videoUrl?: string;
  audioUrl?: string;
}

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
  const isMobile = useIsMobile();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [useCarousel, setUseCarousel] = useState(isMobile || previews.length > 3);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const [currentVideoHover, setCurrentVideoHover] = useState<string | null>(null);
  const videoTimeoutRef = useRef<any>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const detectNavbarVisibility = () => {
      const navbar = document.querySelector('header.sticky') || document.querySelector('header[class*="sticky"]') || document.querySelector('div[class*="sticky"]');
      if (navbar) {
        observerRef.current = new IntersectionObserver(entries => {
          setIsNavbarVisible(entries[0].isIntersecting);
        }, {
          threshold: 0.1
        });
        observerRef.current.observe(navbar);
      }
    };

    const timer = setTimeout(detectNavbarVisibility, 500);
    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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

  const handleVideoHover = (preview: MusicPreview) => {
    if (!preview.hasVideo || !preview.videoUrl) return;
    
    if (videoTimeoutRef.current) {
      clearTimeout(videoTimeoutRef.current);
    }
    
    setCurrentVideoHover(preview.title);
    
    videoTimeoutRef.current = setTimeout(() => {
      setCurrentVideoHover(null);
    }, 10000);
  };
  
  const handleVideoLeave = () => {
    if (videoTimeoutRef.current) {
      clearTimeout(videoTimeoutRef.current);
      videoTimeoutRef.current = null;
    }
    setCurrentVideoHover(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      checkCardDistortion();
    };

    const checkCardDistortion = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      const heightThreshold = 700;

      if (!isNavbarVisible) {
        setUseCarousel(false);
        return;
      }

      if (window.innerWidth < 768) {
        setUseCarousel(true);
      } else if (window.innerHeight < heightThreshold) {
        setUseCarousel(true);
      } else if (window.innerWidth < 1024) {
        setUseCarousel(previews.length > 2);
      } else if (window.innerWidth < 1280) {
        setUseCarousel(previews.length > 3);
      } else {
        setUseCarousel(previews.length > 3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [previews.length, isNavbarVisible]);

  const getCardWidth = () => {
    return "320px";
  };

  const updatedPreviews = previews.map(preview => {
    if (preview.hasVideo && !preview.videoUrl) {
      const videoUrls = [
        "/lovable-uploads/Bad Bunny - Moscow Mule (Video Oficial)  Un Verano Sin Ti.mp4",
        "/lovable-uploads/W Sound 05 LA PLENA - Beéle, Westcol, Ovy On The Drums.mp4"
      ];
      return {
        ...preview,
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)]
      };
    }
    return preview;
  });

  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-6">Preview</h2>
      
      {updatedPreviews?.length > 0 && (
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
                {updatedPreviews.map((preview, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4"
                    style={{
                      width: getCardWidth(),
                      flex: `0 0 ${getCardWidth()}`
                    }}
                  >
                    {preview.image ? (
                      <ImagePreviewCard
                        preview={preview}
                        artistName={artistName}
                        isPlaying={currentlyPlaying === preview.title}
                        isLoading={loadingAudio === preview.title}
                        onPlayPause={() => handlePlayPause(preview)}
                        isVideoHover={currentVideoHover === preview.title}
                        onMouseEnter={() => handleVideoHover(preview)}
                        onMouseLeave={handleVideoLeave}
                      />
                    ) : (
                      <NoImagePreviewCard
                        preview={preview}
                        artistName={artistName}
                        isPlaying={currentlyPlaying === preview.title}
                        isLoading={loadingAudio === preview.title}
                        onPlayPause={() => handlePlayPause(preview)}
                      />
                    )}
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
              {updatedPreviews.map((preview, index) => (
                <div key={index} style={{ width: getCardWidth(), flex: `0 0 ${getCardWidth()}` }}>
                  {preview.image ? (
                    <ImagePreviewCard
                      preview={preview}
                      artistName={artistName}
                      isPlaying={currentlyPlaying === preview.title}
                      isLoading={loadingAudio === preview.title}
                      onPlayPause={() => handlePlayPause(preview)}
                      isVideoHover={currentVideoHover === preview.title}
                      onMouseEnter={() => handleVideoHover(preview)}
                      onMouseLeave={handleVideoLeave}
                    />
                  ) : (
                    <NoImagePreviewCard
                      preview={preview}
                      artistName={artistName}
                      isPlaying={currentlyPlaying === preview.title}
                      isLoading={loadingAudio === preview.title}
                      onPlayPause={() => handlePlayPause(preview)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {!useCarousel && isNavbarVisible && (
            <div className="grid gap-6" style={{ 
              gridTemplateColumns: `repeat(auto-fill, minmax(${getCardWidth()}, 1fr))` 
            }}>
              {updatedPreviews.map((preview, index) => (
                <div key={index}>
                  {preview.image ? (
                    <ImagePreviewCard
                      preview={preview}
                      artistName={artistName}
                      isPlaying={currentlyPlaying === preview.title}
                      isLoading={loadingAudio === preview.title}
                      onPlayPause={() => handlePlayPause(preview)}
                      isVideoHover={currentVideoHover === preview.title}
                      onMouseEnter={() => handleVideoHover(preview)}
                      onMouseLeave={handleVideoLeave}
                    />
                  ) : (
                    <NoImagePreviewCard
                      preview={preview}
                      artistName={artistName}
                      isPlaying={currentlyPlaying === preview.title}
                      isLoading={loadingAudio === preview.title}
                      onPlayPause={() => handlePlayPause(preview)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ImagePreviewCard = ({
  preview,
  artistName,
  isPlaying,
  isLoading,
  onPlayPause,
  isVideoHover,
  onMouseEnter,
  onMouseLeave
}: {
  preview: MusicPreview;
  artistName: string;
  isPlaying: boolean;
  isLoading?: boolean;
  onPlayPause: () => void;
  isVideoHover?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
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

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoHover) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(err => {
          console.error("Error reproduciendo video:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoHover]);

  return (
    <Card 
      className="overflow-hidden rounded-3xl relative group cursor-pointer border-none" 
      onClick={handleCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative aspect-[4/5]">
        <img 
          src={preview.image} 
          alt={preview.title} 
          className={`w-full h-full object-cover ${isVideoHover ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} 
        />
        
        {preview.hasVideo && preview.videoUrl && (
          <video 
            ref={videoRef}
            src={preview.videoUrl}
            className={`absolute inset-0 w-full h-full object-cover ${isVideoHover ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 bg-black`}
            muted
            loop
            playsInline
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60 pointer-events-none transition-opacity duration-300 group-hover:opacity-60"></div>
        
        <div className="absolute top-5 left-5 flex gap-2">
          {preview.hasVideo && 
            <Badge className="bg-white text-black font-medium px-4 py-2 rounded-full">
              <Video className="w-4 h-4 mr-1" />
              Video
            </Badge>
          }
          
          {preview.audioUrl && 
            <Badge className="bg-white text-black font-medium px-4 py-2 rounded-full">
              <FileAudio className="w-4 h-4 mr-1" />
              Audio
            </Badge>
          }
        </div>
        
        {preview.hasVideo && (
          <Badge 
            className="absolute top-5 right-5 bg-white text-black font-medium px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={handleExpand}
          >
            <Expand className="w-4 h-4 mr-1" />
            Expandir
          </Badge>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-7 text-white transition-opacity duration-300 group-hover:opacity-100">
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

const NoImagePreviewCard = ({
  preview,
  artistName,
  isPlaying,
  isLoading,
  onPlayPause
}: {
  preview: MusicPreview;
  artistName: string;
  isPlaying: boolean;
  isLoading?: boolean;
  onPlayPause: () => void;
}) => {
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayPause();
  };

  const handleCardClick = () => {
    onPlayPause();
  };

  return <Card className="overflow-hidden rounded-3xl relative group cursor-pointer border-none bg-[#F7F7F7] dark:bg-vyba-dark-secondary/40" onClick={handleCardClick}>
      <div className="relative aspect-[4/5] flex flex-col items-center justify-center p-7">
        <div className="mb-5 opacity-80 group-hover:opacity-40 transition-opacity duration-300">
          <Music className="w-20 h-20 stroke-1" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-7 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-xl font-black line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{artistName}</p>
        </div>

        <Button 
          variant="secondary" 
          size="icon" 
          className={`absolute bottom-7 left-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10 w-10 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
          onClick={handlePlay}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <div className="absolute bottom-7 right-7 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium dark:text-white bg-gray-200 dark:bg-black/50 px-2 py-1 rounded-md">{preview.duration}</span>
        </div>
      </div>
    </Card>;
};

export default MusicPreviews;
