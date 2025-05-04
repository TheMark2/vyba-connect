
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import Navbar from "@/components/Navbar";
import SimpleNavbar from "@/components/SimpleNavbar";

const thankYouArtists = [
  {
    id: "1",
    name: "DJ Marcos",
    type: "DJ",
    description: "DJ especializado en bodas y eventos corporativos",
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
    id: "2",
    name: "Los Brillantes",
    type: "Banda",
    description: "Banda versátil para todo tipo de eventos",
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
    id: "3",
    name: "Sara Soprano",
    type: "Solista",
    description: "Cantante lírica para ceremonias y eventos formales",
    images: [
      "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
      "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
    ],
    rating: 4.7,
    priceRange: "350-450€",
    isFavorite: false,
  },
];

const SeekerThankYouPage = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/artistas");
  };

  const handleArtistClick = (artistId: string) => {
    navigate(`/artista/${artistId}`);
  };

  // Handle favorite toggle - placeholder function
  const handleFavoriteToggle = (artistId: string) => {
    console.log(`Toggled favorite for artist: ${artistId}`);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <SimpleNavbar />

      <div className="flex-1 flex flex-col items-center px-6 py-12 md:py-16">
        <div className="w-full max-w-3xl text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">¡Gracias por registrarte!</h1>
          <p className="text-lg mb-8">
            Estamos emocionados de que te hayas unido a nuestra comunidad. 
            Ahora puedes explorar y contactar con los mejores artistas para tu evento.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
            <Button 
              onClick={handleExploreClick}
              className="flex items-center justify-center gap-2 px-8 py-6 rounded-full text-lg"
            >
              Explorar artistas 
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="w-full max-w-5xl">
          <h2 className="text-2xl font-semibold mb-6">Artistas destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thankYouArtists.map((artist) => (
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerThankYouPage;
