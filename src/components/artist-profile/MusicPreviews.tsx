
import React, { useState, useRef, useEffect } from "react";
import { Music, Video, Play, Expand, Pause, FileAudio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface MusicPreview {
  title: string;
  duration: string;
  image?: string;
  hasVideo?: boolean;
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
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});
  const actualDurations = useRef<Record<string, string>>({});

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Crear elementos de audio para cada preview
    previews.forEach(preview => {
      if (preview.audioUrl && !audioElementsRef.current[preview.title]) {
        const audio = new Audio(preview.audioUrl);
        
        // Cuando se carga el metadato, actualizar la duración real
        audio.addEventListener('loadedmetadata', () => {
          const minutes = Math.floor(audio.duration / 60);
          const seconds = Math.floor(audio.duration % 60);
          const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
          actualDurations.current[preview.title] = formattedDuration;
        });
        
        audio.addEventListener('ended', () => {
          setCurrentlyPlaying(null);
          if (onPlaybackState && currentlyPlaying === preview.title) {
            onPlaybackState(preview, false);
          }
        });
        
        audioElementsRef.current[preview.title] = audio;
      }
    });

    return () => {
      // Limpiar todos los elementos de audio al desmontar
      Object.values(audioElementsRef.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [previews]);

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
      return;
    }

    const audio = audioElementsRef.current[preview.title];
    if (!audio) return;

    // Si este preview ya está reproduciéndose, pausarlo
    if (currentlyPlaying === preview.title) {
      audio.pause();
      setCurrentlyPlaying(null);
      if (onPlaybackState) {
        onPlaybackState(preview, false);
      }
    } else {
      // Pausar cualquier audio que esté reproduciéndose
      if (currentlyPlaying && audioElementsRef.current[currentlyPlaying]) {
        audioElementsRef.current[currentlyPlaying].pause();
        
        // Notificar que se ha pausado el audio anterior
        const previousPreview = previews.find(p => p.title === currentlyPlaying);
        if (previousPreview && onPlaybackState) {
          onPlaybackState(previousPreview, false);
        }
      }
      
      // Si el audio principal está reproduciéndose, pausarlo también
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Reproducir el nuevo audio
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Reproducción iniciada correctamente");
            setCurrentlyPlaying(preview.title);
            if (onPlaybackState) {
              onPlaybackState(preview, true);
            }
          })
          .catch(error => {
            console.error("Error al reproducir audio:", error);
            // Intentar reproducir de nuevo después de la interacción del usuario
            audio.addEventListener('canplaythrough', () => {
              audio.play().catch(e => console.error("Error en segundo intento:", e));
            }, { once: true });
          });
      }
    }
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

  // Ejemplos de previews para mostrar
  const examplePreviews: MusicPreview[] = [
    {
      title: "Set Verano 2023 - Urban Music",
      duration: "4:32",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
    },
    {
      title: "House Mix - Club Session",
      duration: "3:41",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3",
      hasVideo: true
    },
    {
      title: "Chill Beats - Lounge Collection",
      duration: "5:27",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3"
    }
  ];

  // Usar los previews proporcionados o los ejemplos si no hay ninguno
  const displayPreviews = previews.length > 0 ? previews : examplePreviews;

  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-6">Preview</h2>
      
      {displayPreviews?.length > 0 && (
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
                {displayPreviews.map((preview, index) => (
                  <CarouselItem
                    key={index}
                    className={`pl-4 ${
                      windowWidth < 640
                        ? "basis-[85%]"
                        : windowWidth < 768
                        ? "basis-[45%]"
                        : windowWidth < 1024
                        ? "basis-1/2"
                        : "basis-1/3"
                    }`}
                  >
                    {preview.image ? (
                      <ImagePreviewCard
                        preview={{
                          ...preview,
                          duration: actualDurations.current[preview.title] || preview.duration
                        }}
                        artistName={artistName}
                        isPlaying={currentlyPlaying === preview.title}
                        onPlayPause={() => handlePlayPause(preview)}
                      />
                    ) : (
                      <NoImagePreviewCard
                        preview={{
                          ...preview,
                          duration: actualDurations.current[preview.title] || preview.duration
                        }}
                        artistName={artistName}
                        isPlaying={currentlyPlaying === preview.title}
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
              {displayPreviews.map((preview, index) => (
                <div key={index} className="flex-none w-80">
                  {preview.image ? (
                    <ImagePreviewCard
                      preview={{
                        ...preview,
                        duration: actualDurations.current[preview.title] || preview.duration
                      }}
                      artistName={artistName}
                      isPlaying={currentlyPlaying === preview.title}
                      onPlayPause={() => handlePlayPause(preview)}
                    />
                  ) : (
                    <NoImagePreviewCard
                      preview={{
                        ...preview,
                        duration: actualDurations.current[preview.title] || preview.duration
                      }}
                      artistName={artistName}
                      isPlaying={currentlyPlaying === preview.title}
                      onPlayPause={() => handlePlayPause(preview)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {!useCarousel && isNavbarVisible && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPreviews.map((preview, index) => (
                <div key={index}>
                  {preview.image ? (
                    <ImagePreviewCard
                      preview={{
                        ...preview,
                        duration: actualDurations.current[preview.title] || preview.duration
                      }}
                      artistName={artistName}
                      isPlaying={currentlyPlaying === preview.title}
                      onPlayPause={() => handlePlayPause(preview)}
                    />
                  ) : (
                    <NoImagePreviewCard
                      preview={{
                        ...preview,
                        duration: actualDurations.current[preview.title] || preview.duration
                      }}
                      artistName={artistName}
                      isPlaying={currentlyPlaying === preview.title}
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
  onPlayPause
}: {
  preview: MusicPreview;
  artistName: string;
  isPlaying: boolean;
  onPlayPause: () => void;
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

  return (
    <Card className="overflow-hidden rounded-3xl relative group cursor-pointer border-none" onClick={handleCardClick}>
      <div className="relative aspect-[4/5]">
        <img src={preview.image} alt={preview.title} className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60 pointer-events-none transition-opacity duration-300 group-hover:opacity-0"></div>
        
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
        
        <div className="absolute bottom-0 left-0 right-0 p-7 text-white transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-xl font-black line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-white/80 mb-5">{artistName}</p>
        </div>

        <Button 
          variant="default"
          size="icon" 
          className="absolute bottom-7 left-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8"
          onClick={handlePlay}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-white" />
          ) : (
            <Play className="h-4 w-4 fill-white" />
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
  onPlayPause
}: {
  preview: MusicPreview;
  artistName: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}) => {
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayPause();
  };

  const handleCardClick = () => {
    onPlayPause();
  };

  return (
    <Card className="overflow-hidden rounded-3xl relative group cursor-pointer border-none bg-[#F7F7F7] dark:bg-vyba-dark-secondary/40" onClick={handleCardClick}>
      <div className="relative aspect-[4/5] flex flex-col items-center justify-center p-7">
        <div className="mb-5 opacity-80 group-hover:opacity-40 transition-opacity duration-300">
          <Music className="w-20 h-20 stroke-1" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-7 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-xl font-black line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{artistName}</p>
        </div>

        <Button 
          variant="default"
          size="icon" 
          className="absolute bottom-7 left-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8"
          onClick={handlePlay}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-white" />
          ) : (
            <Play className="h-4 w-4 fill-white" />
          )}
        </Button>
        
        <div className="absolute bottom-7 right-7 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium dark:text-white bg-gray-200 dark:bg-black/50 px-2 py-1 rounded-md">{preview.duration}</span>
        </div>
      </div>
    </Card>
  );
};

export default MusicPreviews;
