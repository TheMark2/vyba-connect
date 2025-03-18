
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Flag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// Datos de ejemplo para los artistas (en producción deberíamos obtenerlos de una API)
const artistsData = [
  {
    id: "1",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
    coverImage: "/lovable-uploads/672e18fa-dfe5-48bb-b838-4f7f26998dc3.png",
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  }, {
    id: "2",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png"],
    coverImage: "/lovable-uploads/672e18fa-dfe5-48bb-b838-4f7f26998dc3.png",
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  }, {
    id: "3",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
    coverImage: "/lovable-uploads/672e18fa-dfe5-48bb-b838-4f7f26998dc3.png",
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  }
  // ... más artistas si es necesario
];

const ArtistProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Encontrar el artista por ID
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
    // En producción, integrarlo con Web Share API si está disponible
    toast.success("Enlace copiado al portapapeles", {
      position: "bottom-center",
    });
  };
  
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-10 lg:px-14 xl:px-16">
        {/* Portada con gradiente y foto de perfil */}
        <div className="relative w-full h-[70vh] sm:h-[60vh] md:h-[70vh] overflow-hidden rounded-[40px] lg:rounded-[50px]">
          {/* Imagen de portada */}
          <img 
            src={artist.coverImage} 
            alt={`${artist.name} portada`}
            className="w-full h-full object-cover"
          />
          
          {/* Gradiente sobre la imagen */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          
          {/* Botones de acción en la esquina superior derecha */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex space-x-2">
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-10 h-10 rounded-full"
              onClick={handleFavorite}
            >
              <Heart className="h-5 w-5 text-black" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-10 h-10 rounded-full"
              onClick={handleReport}
            >
              <Flag className="h-5 w-5 text-black" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-10 h-10 rounded-full"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5 text-black" />
            </Button>
          </div>
          
          {/* Contenido en la parte inferior */}
          <div className="absolute bottom-12 left-16 md:left-12 flex items-center">
            {/* Foto de perfil */}
            <div className="rounded-full overflow-hidden border-4 border-white bg-white mr-4 md:mr-6 w-24 h-24 md:w-32 md:h-32">
              <img 
                src={artist.images[0]} 
                alt={artist.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Información del artista */}
            <div className="text-white space-y-4">
              <h1 className="text-3xl md:text-5xl font-black">{artist.name}</h1>
              <p className="text-xl md:text-2xl opacity-90">{artist.description}</p>
            </div>
          </div>
        </div>
        
        {/* Aquí se pueden añadir más secciones como bio, tarifas, portfolio, etc. */}
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-10">
          {/* Contenido adicional del perfil se implementará en futuras actualizaciones */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArtistProfilePage;
