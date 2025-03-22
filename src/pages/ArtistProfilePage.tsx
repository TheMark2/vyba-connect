
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Flag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const artistsData = [
  {
    id: "1",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: [
      "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", 
      "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", 
      "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png",
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
      "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", 
      "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
      "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png", 
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png"
    ],
    coverImage: "/lovable-uploads/672e18fa-dfe5-48bb-b838-4f7f26998dc3.png",
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  }, {
    id: "2",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: [
      "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", 
      "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", 
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
      "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png",
      "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
      "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png"
    ],
    coverImage: "/lovable-uploads/672e18fa-dfe5-48bb-b838-4f7f26998dc3.png",
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  }, {
    id: "3",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: [
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", 
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png", 
      "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png",
      "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
      "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png"
    ],
    coverImage: "/lovable-uploads/672e18fa-dfe5-48bb-b838-4f7f26998dc3.png",
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  }
];

const ArtistProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const artist = artistsData.find(artist => artist.id === id);
  
  if (!artist) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <h1 className="text-2xl font-bold mb-4">Artista no encontrado</h1>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>
        <Footer />
      </>
    );
  }
  
  const handleFavorite = () => {
    toast.success("Añadido a favoritos", {
      icon: "❤️",
      position: "bottom-center",
    });
  };
  
  const handleReport = () => {
    toast.info("Gracias por informarnos", {
      description: "Revisaremos el perfil lo antes posible",
      position: "bottom-center",
    });
  };
  
  const handleShare = () => {
    toast.success("Enlace copiado al portapapeles", {
      position: "bottom-center",
    });
  };
  
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-10 lg:px-14 xl:px-16">
        <div className="relative w-full h-[calc(70vh)] md:h-[calc(80vh)] overflow-hidden rounded-[25px] lg:rounded-[35px]">
          <img 
            src={artist.coverImage} 
            alt={`${artist.name} portada`}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex space-x-2">
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-10 h-10 rounded-full"
              onClick={handleFavorite}
            >
              <Heart className="h-5 w-5 text-black dark:text-white" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-10 h-10 rounded-full"
              onClick={handleReport}
            >
              <Flag className="h-5 w-5 text-black dark:text-white" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-10 h-10 rounded-full"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5 text-black dark:text-white" />
            </Button>
          </div>
          
          {isMobile ? (
            <div className="absolute bottom-12 left-5 right-0 flex flex-col items-start">
              <div className="rounded-full overflow-hidden mb-4 w-24 h-24">
                <img 
                  src={artist.images[0]} 
                  alt={artist.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <div className="text-white space-y-2 max-w-[85%]">
                <h1 className="text-2xl font-black truncate">{artist.name}</h1>
                <p className="text-lg opacity-90 line-clamp-2">{artist.description}</p>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-12 left-5 md:left-10 lg:left-14 flex items-center">
              <div className="rounded-full overflow-hidden mr-4 md:mr-6 w-24 h-24 md:w-32 md:h-32">
                <img 
                  src={artist.images[0]} 
                  alt={artist.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <div className="text-white space-y-4 max-w-[80%]">
                <h1 className="text-3xl md:text-5xl font-black truncate">{artist.name}</h1>
                <p className="text-xl md:text-2xl opacity-90 line-clamp-2">{artist.description}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="max-w-screen-xl mx-auto px-0 md:px-10 py-10">
          <div className="min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4">Información adicional</h2>
            <p className="text-lg mb-8">
              Aquí puedes añadir más información sobre el artista, como su biografía,
              experiencia, eventos pasados, testimonios de clientes, etc.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-secondary dark:bg-vyba-dark-secondary/30 p-6 rounded-3xl">
                <h3 className="text-xl font-bold mb-3">Experiencia</h3>
                <p>
                  {artist.name} tiene más de 10 años de experiencia como DJ profesional,
                  habiendo actuado en los mejores clubes y eventos de la ciudad.
                </p>
              </div>
              
              <div className="bg-secondary dark:bg-vyba-dark-secondary/30 p-6 rounded-3xl">
                <h3 className="text-xl font-bold mb-3">Servicios</h3>
                <p>
                  Ofrece servicios de DJ para bodas, fiestas privadas, eventos corporativos
                  y clubes nocturnos. Incluye equipo propio de sonido e iluminación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArtistProfilePage;
