
import React, { useState, useEffect } from "react";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import Footer from "@/components/Footer";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import Navbar2 from "@/components/navbar/navbar2";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import FavoriteDialog from "@/components/FavoriteDialog";

// Datos de ejemplo para los artistas con IDs únicos garantizados
export const artistsData = [
    {
        id: "1",
        name: "Antonia Pedragosa",
        type: "DJ",
        description: "DJ para todo tipo de eventos",
        images: [
            "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
            "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
            "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"
        ],
        rating: 4.9,
        priceRange: "400-500€",
        isFavorite: false
    },
    {
        id: "101",
        name: "Antonia Morales",
        type: "DJ",
        description: "DJ para todo tipo de eventos",
        images: [
            "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
            "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
            "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"
        ],
        rating: 4.9,
        priceRange: "400-500€",
        isFavorite: false
    },
    {
        id: "102",
        name: "Victoria Sánchez",
        type: "DJ",
        description: "DJ para todo tipo de eventos",
        images: [
            "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
            "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
            "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"
        ],
        rating: 4.9,
        priceRange: "400-500€",
        isFavorite: false
    },
    {
        id: "103",
        name: "Clara Domínguez",
        type: "DJ",
        description: "DJ para todo tipo de eventos",
        images: [
            "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
            "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
            "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"
        ],
        rating: 4.9,
        priceRange: "400-500€",
        isFavorite: false
    },
    {
        id: "104",
        name: "Lucía Fernández",
        type: "DJ",
        description: "DJ para todo tipo de eventos",
        images: [
            "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
            "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
            "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"
        ],
        rating: 4.9,
        priceRange: "400-500€",
        isFavorite: false
    },
    {
        id: "2",
        name: "Juan Martínez",
        type: "DJ",
        description: "DJ para todo tipo de eventos",
        images: [
            "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
            "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
            "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png"
        ],
        rating: 4.9,
        priceRange: "400-500€",
        isFavorite: false
    },
    {
        id: "3",
        name: "María López",
        type: "DJ",
        description: "DJ para todo tipo de eventos",
        images: [
            "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
            "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
            "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"
        ],
        rating: 4.9,
        priceRange: "400-500€",
        isFavorite: false
    },
    {
        id: "4",
        name: "David García",
        type: "DJ",
        description: "DJ para todo tipo de eventos",
        images: [
            "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
            "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
            "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png"
        ],
        rating: 4.9,
        priceRange: "400-500€",
        isFavorite: false
    },
    {
        id: "5",
        name: "Carlos Martínez",
        type: "Banda",
        description: "Banda para bodas y eventos privados",
        images: [
            "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
            "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
            "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png"
        ],
        rating: 4.7,
        priceRange: "600-800€",
        isFavorite: false
    },
    {
        id: "6",
        name: "Laura González",
        type: "Solista",
        description: "Cantante solista para ceremonias",
        images: [
            "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png",
            "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
            "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png"
        ],
        rating: 4.8,
        priceRange: "350-450€",
        isFavorite: false
    },
    {
        id: "7",
        name: "Miguel Torres",
        type: "Grupo",
        description: "Grupo musical versátil para fiestas",
        images: [
            "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
            "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
            "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png"
        ],
        rating: 4.6,
        priceRange: "550-700€",
        isFavorite: false
    },
    {
        id: "8",
        name: "Andrea Vega",
        type: "Violinista",
        description: "Violinista para eventos elegantes",
        images: [
            "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png",
            "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
            "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"
        ],
        rating: 4.9,
        priceRange: "400-500€",
        isFavorite: false
    }
];

const ArtistsPage = () => {
  const [artists, setArtists] = useState(artistsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavoriteDialog, setShowFavoriteDialog] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<typeof artistsData[0] | null>(null);
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleArtistClick = (artist: typeof artistsData[0]) => {
    console.log("Artista seleccionado:", artist);
    navigate(`/artista/${artist.id}`);
  };

  const handleFavoriteToggle = (artist: typeof artistsData[0]) => {
    if (!user) {
      toast.error("Inicia sesión para añadir favoritos", {
        position: "bottom-center",
      });
      return;
    }
    
    setSelectedArtist(artist);
    setShowFavoriteDialog(true);
  };

  const handleFavoriteConfirm = () => {
    if (!selectedArtist) return;
    
    // Actualizar el estado de favorito del artista seleccionado
    setArtists(prevArtists => 
      prevArtists.map(a => 
        a.id === selectedArtist.id 
          ? { ...a, isFavorite: !a.isFavorite } 
          : a
      )
    );
    
    setSelectedArtist(null);
  };

  return (
    <>
      <Navbar2 />
      <div className="px-6 md:px-6 lg:px-16 mx-auto mt-6 mb-8">

        <div className={`
          ${isSmallMobile
            ? "grid grid-cols-1 gap-6"
            : isMobile
              ? "grid grid-cols-2 gap-8"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6 mt-32"
          }
        `}>
          {artists.map(artist => (
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
              onClick={() => handleArtistClick(artist)} 
              onFavoriteToggle={() => handleFavoriteToggle(artist)} 
              className={isMobile ? "mb-2" : ""}
            />
          ))}
        </div>
      </div>
      
      {/* Diálogo de favoritos */}
      {selectedArtist && (
        <FavoriteDialog
          open={showFavoriteDialog}
          onOpenChange={setShowFavoriteDialog}
          artistName={selectedArtist.name}
          artistId={selectedArtist.id}
          onConfirm={handleFavoriteConfirm}
          isFavorite={selectedArtist.isFavorite}
        />
      )}
      
      <Footer />
    </>
  );
};

export default ArtistsPage;
