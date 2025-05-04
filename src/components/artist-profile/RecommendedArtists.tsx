
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Datos de ejemplo para artistas recomendados
const recommendedArtists = [
  {
    id: "9",
    name: "Luis Gomez",
    type: "DJ",
    description: "DJ especializado en música electrónica",
    images: [
      "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
      "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
      "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png",
    ],
    rating: 4.8,
    priceRange: "450-550€",
    isFavorite: false,
  },
  {
    id: "10",
    name: "Ana Rodriguez",
    type: "Banda",
    description: "Banda de música versátil para eventos",
    images: [
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
      "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
      "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png",
    ],
    rating: 4.9,
    priceRange: "600-800€",
    isFavorite: false,
  },
  {
    id: "11",
    name: "Javier Fernández",
    type: "Solista",
    description: "Cantante para eventos íntimos",
    images: [
      "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
      "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
    ],
    rating: 4.7,
    priceRange: "350-450€",
    isFavorite: false,
  },
  {
    id: "12",
    name: "Laura García",
    type: "DJ",
    description: "DJ para fiestas privadas",
    images: [
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
      "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png",
    ],
    rating: 4.8,
    priceRange: "400-500€",
    isFavorite: false,
  },
];

interface RecommendedArtistsProps {
  currentArtistId?: string;
  title?: string;
  subtitle?: string;
  regularBadge?: boolean;
  regularText?: boolean;
}

const RecommendedArtists: React.FC<RecommendedArtistsProps> = ({
  currentArtistId,
  title = "Artistas similares",
  subtitle = "Basados en tus preferencias",
  regularBadge = false,
  regularText = false,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState<any>(null);

  // Filtrar el artista actual si se proporciona un ID
  const filteredArtists = currentArtistId
    ? recommendedArtists.filter((artist) => artist.id !== currentArtistId)
    : recommendedArtists;

  const handleArtistClick = (artistId: string) => {
    navigate(`/artista/${artistId}`);
  };

  // Esta función simula un toggle de favorito
  const handleFavoriteToggle = (artistId: string) => {
    return artistId; // Solo devolver el ID para simular la acción
  };

  return (
    <div className="py-8 px-4 md:px-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        
        {!isMobile && filteredArtists.length > 3 && (
          <div className="flex gap-2">
            <button
              onClick={() => swiper?.slidePrev()}
              className="p-2 rounded-full border hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => swiper?.slideNext()}
              className="p-2 rounded-full border hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-5">
          {filteredArtists.slice(0, 2).map((artist) => (
            <ArtistProfileCard
              key={artist.id}
              id={artist.id}
              name={artist.name}
              type={artist.type}
              description={artist.description}
              images={artist.images}
              rating={artist.rating}
              priceRange={artist.priceRange}
              isFavorite={artist.isFavorite}
              onClick={() => handleArtistClick(artist.id)}
              onFavoriteToggle={() => handleFavoriteToggle(artist.id)}
              isRecommended={true}
              hideHeart={true}
              regularBadge={regularBadge}
              regularText={regularText}
            />
          ))}
        </div>
      ) : (
        <Swiper
          onSwiper={setSwiper}
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="recommended-artists-swiper"
        >
          {filteredArtists.map((artist) => (
            <SwiperSlide key={artist.id}>
              <ArtistProfileCard
                id={artist.id}
                name={artist.name}
                type={artist.type}
                description={artist.description}
                images={artist.images}
                rating={artist.rating}
                priceRange={artist.priceRange}
                isFavorite={artist.isFavorite}
                onClick={() => handleArtistClick(artist.id)}
                onFavoriteToggle={() => handleFavoriteToggle(artist.id)}
                isRecommended={true}
                hideHeart={true}
                regularBadge={regularBadge}
                regularText={regularText}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default RecommendedArtists;
