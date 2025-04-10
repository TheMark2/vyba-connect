
import React, { useEffect, useState, useRef } from "react";
import { Music, Video, Play, Expand, Pause, FileAudio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AudioPlayer from "./AudioPlayer";

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
  const [trackDurations, setTrackDurations] = useState<Record<string, string>>({});
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Inicializar un objeto para almacenar referencias a los elementos de audio
  useEffect(() => {
    const audioElementsObj: Record<string, HTMLAudioElement> = {};
    
    previews.forEach((preview) => {
      if (preview.audioUrl) {
        const audio = new Audio(preview.audioUrl);
        audioElementsObj[preview.title] = audio;
        
        // Configurar manejadores de eventos para cada elemento de audio
        audio.addEventListener('ended', () => {
          setCurrentlyPlaying(null);
        });
      }
    });
    
    setAudioElements(audioElementsObj);
    
    // Limpieza al desmontar
    return () => {
      Object.values(audioElementsObj).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [previews]);

  useEffect(() => {
    // Función para precargar los tracks y obtener su duración
    const preloadTracks = async () => {
      const durations: Record<string, string> = {};
      
      for (const preview of previews) {
        if (preview.audioUrl) {
          try {
            const audio = new Audio(preview.audioUrl);
            
            // Esperar a que se carguen los metadatos
            await new Promise<void>((resolve) => {
              audio.addEventListener('loadedmetadata', () => {
                if (!isNaN(audio.duration)) {
                  const minutes = Math.floor(audio.duration / 60);
                  const seconds = Math.floor(audio.duration % 60);
                  durations[preview.title] = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                } else {
                  durations[preview.title] = preview.duration; // Usar la duración proporcionada si no se puede obtener
                }
                resolve();
              }, { once: true });
              
              audio.addEventListener('error', () => {
                console.error(`Error al cargar el audio: ${preview.title}`);
                durations[preview.title] = preview.duration; // Usar la duración proporcionada en caso de error
                resolve();
              }, { once: true });
            });
          } catch (error) {
            console.error(`Error al precargar: ${preview.title}`, error);
            durations[preview.title] = preview.duration;
          }
        } else {
          durations[preview.title] = preview.duration;
        }
      }
      
      setTrackDurations(durations);
    };
    
    preloadTracks();
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
    if (!preview.audioUrl) {
      console.log(`No hay URL de audio para: ${preview.title}`);
      toast.error("Este preview no tiene audio disponible");
      return;
    }

    // Si ya hay alguno sonando, lo pausamos
    if (currentlyPlaying && currentlyPlaying !== preview.title) {
      if (audioElements[currentlyPlaying]) {
        audioElements[currentlyPlaying].pause();
      }
    }

    const audio = audioElements[preview.title];
    
    if (!audio) return;
    
    if (currentlyPlaying === preview.title) {
      // Pausar si ya se está reproduciendo
      audio.pause();
      setCurrentlyPlaying(null);
    } else {
      // Reproducir nuevo audio
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setCurrentlyPlaying(preview.title);
          })
          .catch(error => {
            console.error("Error al reproducir audio:", error);
            toast.error("Error al reproducir el audio. Inténtalo de nuevo.");
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

  // Ejemplos de audio para pruebas
  const examplePreviews = [
    {
      title: "Chill Beats Mix 2023",
      duration: "3:45",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
    },
    {
      title: "Summer House Party",
      duration: "2:50",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3"
    },
    {
      title: "Electronic Dreams",
      duration: "4:10",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3"
    },
    {
      title: "Jazz Lounge",
      duration: "3:20",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-chill-with-me-683.mp3"
    },
    {
      title: "Dubstep Beats",
      duration: "2:35",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3"
    }
  ];

  // Usar los previews proporcionados o los ejemplos si no hay ninguno
  const displayPreviews = previews.length > 0 ? previews : examplePreviews;

  // Renderizar el componente de audio para cada preview
  const renderPreviewCard = (preview: MusicPreview, index: number) => {
    const isPlaying = currentlyPlaying === preview.title;
    const duration = trackDurations[preview.title] || preview.duration;
    
    return (
      <div key={index} className={preview.image ? "" : "flex-none w-80"}>
        {preview.image ? (
          <div className="relative">
            <ImagePreviewCard
              preview={{
                ...preview,
                duration
              }}
              artistName={artistName}
              isPlaying={isPlaying}
              onPlayPause={() => handlePlayPause(preview)}
            />
            {isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <AudioPlayer
                  preview={{
                    ...preview,
                    duration
                  }}
                  artistName={artistName}
                  isPlaying={isPlaying}
                  onPlayPause={() => handlePlayPause(preview)}
                  audioRef={audioRef}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <NoImagePreviewCard
              preview={{
                ...preview,
                duration
              }}
              artistName={artistName}
              isPlaying={isPlaying}
              onPlayPause={() => handlePlayPause(preview)}
            />
            {isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <AudioPlayer
                  preview={{
                    ...preview,
                    duration
                  }}
                  artistName={artistName}
                  isPlaying={isPlaying}
                  onPlayPause={() => handlePlayPause(preview)}
                  audioRef={audioRef}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
              {displayPreviews.map((preview, index) => renderPreviewCard(preview, index))}
            </div>
          )}

          {!useCarousel && isNavbarVisible && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPreviews.map((preview, index) => renderPreviewCard(preview, index))}
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
    <Card 
      className="overflow-hidden rounded-3xl relative group cursor-pointer border-none" 
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/5]">
        <img 
          src={preview.image} 
          alt={preview.title} 
          className="w-full h-full object-cover" 
        />
        
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
          variant="secondary" 
          size="icon" 
          className="absolute bottom-7 left-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10 w-10 bg-white hover:bg-white/90 text-black"
          onClick={handlePlay}
        >
          {isPlaying ? (
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
    <Card 
      className="overflow-hidden rounded-3xl relative group cursor-pointer border-none bg-[#F7F7F7] dark:bg-vyba-dark-secondary/40" 
      onClick={handleCardClick}
    >
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
          className="absolute bottom-7 left-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10 w-10"
          onClick={handlePlay}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
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
