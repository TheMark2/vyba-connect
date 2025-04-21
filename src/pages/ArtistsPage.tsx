import React, { useState } from "react";
import { Sparkles, Blend } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

// Datos de ejemplo para los artistas
export const artistsData = [
  {
    id: "1",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  },
  {
    id: "1",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  },
  {
    id: "1",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  },
  {
    id: "1",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  },
  {
    id: "1",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  },
  {
    id: "2",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  },
  {
    id: "3",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  },
  {
    id: "4",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png", "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png", "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  },
  {
    id: "5",
    name: "Carlos Martínez",
    type: "Banda",
    description: "Banda para bodas y eventos privados",
    images: ["/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png", "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png", "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png"],
    rating: 4.7,
    priceRange: "600-800€",
    isFavorite: false
  },
  {
    id: "6",
    name: "Laura González",
    type: "Solista",
    description: "Cantante solista para ceremonias",
    images: ["/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png", "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png", "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png"],
    rating: 4.8,
    priceRange: "350-450€",
    isFavorite: false
  },
  {
    id: "7",
    name: "Miguel Torres",
    type: "Grupo",
    description: "Grupo musical versatil para fiestas",
    images: ["/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png", "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png"],
    rating: 4.6,
    priceRange: "550-700€",
    isFavorite: false
  },
  {
    id: "8",
    name: "Andrea Vega",
    type: "Violinista",
    description: "Violinista para eventos elegantes",
    images: ["/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png", "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  }
];

const ArtistsPage = () => {
  const [artists, setArtists] = useState(artistsData);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  const navigate = useNavigate();

  const handleArtistClick = (artist: typeof artistsData[0]) => {
    console.log("Artista seleccionado:", artist);
    navigate(`/artista/${artist.id}`);
  };

  const handleFavoriteToggle = (artist: typeof artistsData[0]) => {
    setArtists(prevArtists => 
      prevArtists.map(a => 
        a.id === artist.id 
          ? { ...a, isFavorite: !a.isFavorite } 
          : a
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-6 lg:px-16 mx-auto mt-6 mb-8">
        <div className={`
          ${isMobile 
            ? "bg-[#F7F7F7] dark:bg-vyba-dark-secondary/40 rounded-3xl py-6 mb-6 px-6"
            : "bg-[#F7F7F7] dark:bg-vyba-dark-secondary/40 rounded-3xl py-8 mb-12 px-16"
          }
          flex flex-col md:flex-row md:justify-between items-center justify-center h-[200px] overflow-hidden group
        `}>
          <div className={`${isMobile ? "text-center" : ""}`}>
            <h1 className={`
              ${isMobile 
                ? "text-3xl font-semibold mb-1" 
                : "text-5xl font-semibold mb-2"
              }
            `}>
              Todos los artistas
            </h1>
            <p className={`
              ${isMobile 
                ? "text-2xl font-light text-vyba-tertiary mb-0" 
                : "text-4xl font-light text-vyba-tertiary mb-0"
              }
            `}>
              {artists.length} artistas
            </p>
          </div>
          
          <div className="min-h-screen flex items-center justify-center p-10 translate-y-[7%] grup-ho">
            <div className="relative w-[250px] h-[250px]">
              {/* Imagen 1 (atrás, rotada a la izquierda) */}
              <img
                src="/lovable-uploads/image.png"
                alt="Imagen 1"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl transform -rotate-12 z-0 shadow-xl group-hover:-rotate-[18deg] transition-transform duration-300 ease-in-out z-0"
              />
              
              {/* Imagen 2 (medio, recta pero desplazada un poco) */}
              <img
                src="/lovable-uploads/image1.png"
                alt="Imagen 2"
                className="absolute top-2 left-6 w-full h-full object-cover rounded-3xl transform rotate-1 z-10 shadow-2xl group-hover:top-[-10px] transition-all duration-300 ease-in-out z-10"
              />
              
              {/* Imagen 3 (frontal, rotada a la derecha) */}
              <img
                src="/lovable-uploads/image2.png"
                alt="Imagen 3"
                className="absolute top-5 left-12 w-full h-full object-cover rounded-3xl transform rotate-12 z-20 shadow-2xl group-hover:-rotate-[-18deg] transition-transform duration-300 ease-in-out z-20"
              />
            </div>
          </div>
        </div>

        <div className={`
          ${isSmallMobile
            ? "grid grid-cols-1 gap-6" // Increased vertical gap from 4 to 6
            : isMobile
              ? "grid grid-cols-2 gap-8" // Increased vertical gap from 4 to 6
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6" // Increased vertical gap from 4 to 6
          }
        `}>
          {artists.map(artist => (
            <ArtistProfileCard 
              key={artist.id} 
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
      <Footer />
    </>
  );
};

export default ArtistsPage;
