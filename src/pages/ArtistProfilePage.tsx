import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArtistBanner from "@/components/artist-profile/ArtistBanner";
import AboutArtist from "@/components/artist-profile/AboutArtist";
import DetailedInformation from "@/components/artist-profile/DetailedInformation";
import EventTypes from "@/components/artist-profile/EventTypes";
import ArtistFAQ from "@/components/artist-profile/ArtistFAQ";
import ArtistReviews from "@/components/artist-profile/ArtistReviews";
import RecommendedArtists from "@/components/artist-profile/RecommendedArtists";
import NotFoundArtist from "@/components/artist-profile/NotFoundArtist";
import GroupMembers from "@/components/artist-profile/GroupMembers";
import MusicPreviews from "@/components/artist-profile/MusicPreviews";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopArtistNavbar from "@/components/artist-profile/DesktopArtistNavbar";
import MobileArtistNavbar from "@/components/artist-profile/MobileArtistNavbar";

const artistsData = [{
  id: "1",
  name: "Antonia Pedragosa",
  type: "DJ",
  description: "¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado! Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨ Con años de experiencia y un repertorio cautivador, puedo crear la atmósfera perfecta para tu ocasión especial. Ya sea una boda íntima, una fiesta corporativa o una velada romántica, mi música te transportará a un mundo lleno de melodías irresistibles.",
  genres: ["Pop", "House", "Reggaeton", "Comercial"],
  location: "Barcelona",
  availability: "Esta semana disponible",
  images: ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070", "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070", "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070", "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=1000", "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?q=80&w=2070"],
  coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070",
  rating: 4.5,
  reviews: 34,
  priceRange: "150-400€",
  isFavorite: false,
  experience: ["TotKfe - Caldes de Montbui", "TotKfe - Caldes de Montbui", "TotKfe - Caldes de Montbui"],
  equipment: ["Con equipo propio", "Para <100 personas"],
  timeRequirements: ["10-15 minutos de prueba de sonido", "1h de montaje"],
  education: ["Conservatorio Provincial de Música Luis Gianneo"],
  eventTypes: ["Bodas", "Fiestas Privadas", "Cumpleaños", "Eventos Corporativos", "Inauguraciones", "Aniversarios", "Cenas de Gala"],
  reviewsData: [{
    id: 1,
    name: "Antonia Pedragosa",
    date: "4 días",
    rating: 4,
    badges: ["Reggaeton", "Comercial"],
    comment: "¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado! Soy Rodrigo Belga, un apasionado saxofonista especializado en jazz, bossa nova y blues. 🎷✨"
  }, {
    id: 2,
    name: "Antonia Pedragosa",
    date: "4 días",
    rating: 4,
    badges: ["Reggaeton", "Comercial"],
    comment: "¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado! Soy Rodrigo Belga, un apasionado saxofonista especializado en jazz, bossa nova y blues. 🎷✨"
  }, {
    id: 3,
    name: "Antonia Pedragosa",
    date: "4 días",
    rating: 4,
    badges: ["Reggaeton", "Comercial"],
    comment: "¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado! Soy Rodrigo Belga, un apasionado saxofonista especializado en jazz, bossa nova y blues. 🎷✨"
  }],
  groupMembers: [{
    id: "gm1",
    name: "Paco Porras",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070",
    roles: ["Guitarrista"]
  }, {
    id: "gm2",
    name: "Paco Porras",
    roles: ["Guitarrista", "Vocalista"]
  }, {
    id: "gm3",
    name: "Lucía Martínez",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
    roles: ["Batería"]
  }, {
    id: "gm4",
    name: "Carlos Gómez",
    roles: ["Bajista", "Coros"]
  }]
}, {
  id: "2",
  name: "Antonia Pedragosa",
  type: "DJ",
  description: "DJ para todo tipo de eventos",
  images: ["https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070", "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070", "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070", "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?q=80&w=2070"],
  coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070",
  rating: 4.9,
  priceRange: "400-500€",
  isFavorite: false,
  experience: ["TotKfe - Caldes de Montbui", "TotKfe - Caldes de Montbui", "TotKfe - Caldes de Montbui"],
  equipment: ["Con equipo propio", "Para <100 personas"],
  timeRequirements: ["10-15 minutos de prueba de sonido", "1h de montaje"],
  education: ["Conservatorio Provincial de Música Luis Gianneo"],
  eventTypes: ["Bodas", "Fiestas Privadas", "Cumpleaños", "Eventos Corporativos"]
}, {
  id: "3",
  name: "Antonia Pedragosa",
  type: "DJ",
  description: "DJ para todo tipo de eventos",
  images: ["https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070", "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070", "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?q=80&w=2070"],
  coverImage: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070",
  rating: 4.9,
  priceRange: "400-500€",
  isFavorite: false,
  experience: ["TotKfe - Caldes de Montbui", "TotKfe - Caldes de Montbui", "TotKfe - Caldes de Montbui"],
  equipment: ["Con equipo propio", "Para <100 personas"],
  timeRequirements: ["10-15 minutos de prueba de sonido", "1h de montaje"],
  education: ["Conservatorio Provincial de Música Luis Gianneo"],
  eventTypes: ["Fiestas Privadas", "Inauguraciones", "Aniversarios"]
}];

const recommendedArtists = [{
  id: "101",
  name: "Marco Olivera",
  type: "Saxofonista",
  description: "Saxofonista con experiencia en eventos y fiestas privadas",
  images: ["/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
  rating: 4.7,
  priceRange: "250-350€",
  isFavorite: false
}, {
  id: "102",
  name: "Laura Gómez",
  type: "Violinista",
  description: "Violinista clásica para bodas y eventos formales",
  images: ["/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png", "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png"],
  rating: 4.9,
  priceRange: "300-450€",
  isFavorite: true
}, {
  id: "103",
  name: "Carlos Mendoza",
  type: "Pianista",
  description: "Pianista versátil para todo tipo de eventos y ocasiones",
  images: ["/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png", "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"],
  rating: 4.8,
  priceRange: "200-400€",
  isFavorite: false
}, {
  id: "104",
  name: "Elena Ruiz",
  type: "Cantante",
  description: "Vocalista con amplio repertorio de jazz y música moderna",
  images: ["/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png", "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png"],
  rating: 4.6,
  priceRange: "270-380€",
  isFavorite: false
}, {
  id: "105",
  name: "Javier Blanco",
  type: "Guitarrista",
  description: "Guitarrista flamenco y clásico para eventos especiales",
  images: ["/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png", "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png"],
  rating: 4.5,
  priceRange: "180-350€",
  isFavorite: true
}];

const ArtistProfilePage = () => {
  const { id } = useParams<{ id: string; }>();
  const navigate = useNavigate();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const isMobile = useIsMobile();
  const aboutMeRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [showMobileBottomSheet, setShowMobileBottomSheet] = useState(false);
  const [isReviewsBottomSheetOpen, setIsReviewsBottomSheetOpen] = useState(false);
  
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isMobile && aboutMeRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0] && !entries[0].isIntersecting) {
            setShowMobileBottomSheet(true);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '-20% 0px 0px 0px'
        }
      );
      
      observer.observe(aboutMeRef.current);
      
      return () => {
        if (aboutMeRef.current) {
          observer.unobserve(aboutMeRef.current);
        }
      };
    }
  }, [isMobile, aboutMeRef]);

  const artist = artistsData.find(artist => artist.id === id);
  if (!artist) {
    return <NotFoundArtist onBack={() => navigate(-1)} />;
  }

  const handleFavorite = () => {
    toast.success("Añadido a favoritos", {
      icon: "❤️",
      position: "bottom-center"
    });
  };

  const handleReport = () => {
    toast.info("Gracias por informarnos", {
      description: "Revisaremos el perfil lo antes posible",
      position: "bottom-center"
    });
  };

  const handleShare = () => {
    toast.success("Enlace copiado al portapapeles", {
      position: "bottom-center"
    });
  };

  const handleContact = () => {
    toast.success(`Contactando con ${artist.name}`, {
      description: "Te conectaremos pronto",
      position: "bottom-center"
    });
  };

  const handleGenreClick = (genre: string) => {
    toast.success(`Buscando más artistas de ${genre}`, {
      position: "bottom-center"
    });
  };

  const handleEventTypeClick = (eventType: string) => {
    toast.success(`Buscando artistas para ${eventType}`, {
      position: "bottom-center"
    });
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const handleReviewsBottomSheetChange = (isOpen: boolean) => {
    setIsReviewsBottomSheetOpen(isOpen);
  };

  const artistContactData = {
    name: artist.name,
    location: artist.location || "",
    availability: artist.availability || "",
    priceRange: artist.priceRange,
    image: artist.images[0],
    type: artist.type,
    rating: artist.rating
  };

  const previews = [
    {
      title: "Set de música urbana",
      duration: "30:40",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
      hasVideo: true,
      videoUrl: "/lovable-uploads/bad-bunny-moscow-mule.mp4"
    },
    {
      title: "Jazz session",
      duration: "15:22",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
      hasVideo: false,
      audioUrl: "/lovable-uploads/bad-bunny-moscow-mule.mp4"
    },
    {
      title: "DJ mix - Summer vibes",
      duration: "45:30",
      hasVideo: true,
      videoUrl: "/lovable-uploads/westcol-la-plena.mp4"
    },
    {
      title: "Instrumental acústico",
      duration: "12:15",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      hasVideo: false,
      audioUrl: "/lovable-uploads/westcol-la-plena.mp4"
    },
    {
      title: "Live session",
      duration: "22:40",
      image: "/lovable-uploads/5956b7b8-43c9-4094-b9f5-ee7f2ecc8dcc.png",
      hasVideo: true
    }
  ];

  const handleMusicPlayback = (preview: any, isPlaying: boolean) => {
    setCurrentPlaying(isPlaying ? preview.title : "");
    setIsAudioPlaying(isPlaying);
  };

  return (
    <div className="bg-white dark:bg-vyba-dark-bg">
      <Navbar />
      <audio ref={audioRef} className="hidden" />
      
      <div className={`${isMobile ? 'px-0' : 'px-6 md:px-10 lg:px-14 xl:px-16'}`}>
        <ArtistBanner artist={artist} onFavorite={handleFavorite} onReport={handleReport} onShare={handleShare} />
      </div>

      <div className="px-6 md:px-10 lg:px-14 xl:px-16 bg-white dark:bg-vyba-dark-bg">
        <div className="pb-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <AboutArtist ref={aboutMeRef} description={artist.description} genres={artist.genres} onGenreClick={handleGenreClick} />
              
              <MusicPreviews 
                previews={previews} 
                artistName={artist.name} 
                onPlaybackState={handleMusicPlayback}
                audioRef={audioRef}
              />
              
              <div ref={imagesRef}>
                <DetailedInformation artist={artist} />
              </div>
              
              {artist.groupMembers && <GroupMembers members={artist.groupMembers} />}
              
              {artist.eventTypes && <EventTypes eventTypes={artist.eventTypes} onEventTypeClick={handleEventTypeClick} />}
              
              <ArtistFAQ artistName={artist.name} />
              
              <div ref={reviewsRef}>
                <ArtistReviews 
                  rating={artist.rating} 
                  reviews={artist.reviews || 0} 
                  genres={artist.genres} 
                  reviewsData={artist.reviewsData} 
                  onBottomSheetChange={handleReviewsBottomSheetChange}
                />
              </div>
            </div>
            
            {!isMobile && (
              <div className="space-y-6">
                <DesktopArtistNavbar 
                  artist={artistContactData} 
                  onContact={handleContact} 
                  aboutMeRef={aboutMeRef}
                  imagesRef={imagesRef}
                  reviewsRef={reviewsRef}
                />
              </div>
            )}
          </div>
        </div>

        <RecommendedArtists artists={recommendedArtists} />
      </div>
      
      {isMobile && showMobileBottomSheet && (
        <MobileArtistNavbar 
          artistContact={artistContactData} 
          onContact={handleContact} 
          aboutMeRef={aboutMeRef} 
          imagesRef={imagesRef}
          reviewsRef={reviewsRef}
          currentPlaying={currentPlaying}
          isAudioPlaying={isAudioPlaying}
          onPlayPause={handlePlayPause}
          audioRef={audioRef}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ArtistProfilePage;
