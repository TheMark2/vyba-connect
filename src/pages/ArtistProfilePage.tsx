import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Flag, Share2, MapPin, ChevronDown, Book, List, Clock, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MUSIC_GENRES } from "@/constants/music";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const artistsData = [
  {
    id: "1",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado! Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨ Con años de experiencia y un repertorio cautivador, puedo crear la atmósfera perfecta para tu ocasión especial. Ya sea una boda íntima, una fiesta corporativa o una velada romántica, mi música te transportará a un mundo lleno de melodías irresistibles.",
    genres: ["Pop", "House", "Reggaeton", "Comercial"],
    location: "Barcelona",
    availability: "Esta semana disponible",
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
    coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    rating: 4.9,
    priceRange: "150-400€",
    isFavorite: false,
    experience: [
      "TotKfe - Caldes de Montbui",
      "TotKfe - Caldes de Montbui",
      "TotKfe - Caldes de Montbui"
    ],
    equipment: [
      "Con equipo propio",
      "Para <100 personas"
    ],
    timeRequirements: [
      "10-15 minutos de prueba de sonido",
      "1h de montaje"
    ],
    education: [
      "Conservatorio Provincial de Música Luis Gianneo"
    ]
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
    coverImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false,
    experience: [
      "TotKfe - Caldes de Montbui",
      "TotKfe - Caldes de Montbui",
      "TotKfe - Caldes de Montbui"
    ],
    equipment: [
      "Con equipo propio",
      "Para <100 personas"
    ],
    timeRequirements: [
      "10-15 minutos de prueba de sonido",
      "1h de montaje"
    ],
    education: [
      "Conservatorio Provincial de Música Luis Gianneo"
    ]
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
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false,
    experience: [
      "TotKfe - Caldes de Montbui",
      "TotKfe - Caldes de Montbui",
      "TotKfe - Caldes de Montbui"
    ],
    equipment: [
      "Con equipo propio",
      "Para <100 personas"
    ],
    timeRequirements: [
      "10-15 minutos de prueba de sonido",
      "1h de montaje"
    ],
    education: [
      "Conservatorio Provincial de Música Luis Gianneo"
    ]
  }
];

const ArtistProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  
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

  const handleContact = () => {
    toast.success(`Contactando con ${artist.name}`, {
      description: "Te conectaremos pronto",
      position: "bottom-center",
    });
  };
  
  const handleGenreClick = (genre: string) => {
    toast.success(`Buscando más artistas de ${genre}`, {
      position: "bottom-center",
    });
    // Aquí podríamos navegar a una página de búsqueda filtrada por género
    // navigate(`/artistas?genero=${genre}`);
  };
  
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-10 lg:px-14 xl:px-16">
        {/* Banner Section with Blurred Background */}
        <div className="relative w-full h-[95vh] md:h-[calc(80vh)] overflow-hidden rounded-[25px] lg:rounded-[35px] mb-12">
          {/* Blurred background image - Capa base */}
          <div className="absolute inset-0 w-full h-full overflow-visible flex justify-center items-center" style={{ zIndex: 0 }}>
            <div className="absolute w-[120%] h-[120%] opacity-70">
              <img 
                src={artist.coverImage} 
                alt=""
                className="w-full h-full object-cover scale-150 filter blur-3xl"
              />
            </div>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>          
          {/* Main Banner Image - Capa principal */}
          <div className="relative z-10 w-full h-full">
            <img 
              src={artist.coverImage} 
              alt={`${artist.name} portada`}
              className="w-full h-full object-cover rounded-[25px] lg:rounded-[35px]"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </div>
          
          {/* Buttons in top right corner */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex space-x-2 z-20">
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
          
          {/* Artist info overlay */}
          {isMobile ? (
            <div className="absolute bottom-12 left-5 right-0 flex flex-col items-start z-20">
              <div className="rounded-full overflow-hidden mb-4 w-24 h-24">
                <img 
                  src={artist.images[0]} 
                  alt={artist.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <div className="text-white space-y-2 max-w-[85%]">
                <h1 className="text-2xl font-black truncate">{artist.name}</h1>
                <p className="text-lg opacity-90 line-clamp-2">{artist.type}</p>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-12 left-5 md:left-10 lg:left-14 flex items-center z-20">
              <div className="rounded-full overflow-hidden mr-4 md:mr-6 w-24 h-24 md:w-32 md:h-32">
                <img 
                  src={artist.images[0]} 
                  alt={artist.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <div className="text-white space-y-4 max-w-[80%]">
                <h1 className="text-3xl md:text-5xl font-black truncate">{artist.name}</h1>
                <p className="text-xl md:text-2xl opacity-90 line-clamp-2">{artist.type}</p>
              </div>
            </div>
          )}
        </div>

        {/* About Me Section */}
        <div className="pb-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-black mb-6">Sobre mi</h2>
              <p className="text-base mb-5 leading-relaxed">
                {artist.description}
              </p>
              
              {/* Genres - Convertidos a botones */}
              <div className="flex flex-wrap gap-3 mb-10">
                {artist.genres?.map((genre, index) => (
                  <Button 
                    key={index}
                    variant="secondary"
                    className="rounded-full text-sm font-medium"
                    onClick={() => handleGenreClick(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>

              {/* Más información Section */}
              <div className="mt-8 mb-16">
                <h2 className="text-3xl font-black mb-6">Más información</h2>
                <div className="bg-[#F8F8F8] dark:bg-vyba-dark-bg rounded-3xl overflow-hidden">
                  <Collapsible
                    open={isInfoOpen}
                    onOpenChange={setIsInfoOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-between w-full p-6 text-xl font-bold hover:bg-gray-100 dark:hover:bg-vyba-dark-secondary/70 transition-colors duration-200">
                        <span>Experiencia, Repertorio, Logística y Equipamiento, Tiempos</span>
                        <ChevronDown className={`h-6 w-6 transition-transform duration-300 ${isInfoOpen ? "rotate-180" : ""}`} />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-6 pt-0 space-y-8 bg-secondary rounded-2xl">
                      {/* Experiencia */}
                      <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center">
                          <Book className="mr-2 h-5 w-5" />
                          Experiencia
                        </h3>
                        <p className="mb-4">
                          ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
                          Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          {artist.experience?.map((exp, index) => (
                            <UIBadge key={index} variant="outline" className="py-2 px-4 bg-white dark:bg-vyba-dark-secondary">
                              {exp}
                            </UIBadge>
                          ))}
                        </div>
                      </div>

                      {/* Repertorio */}
                      <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center">
                          <List className="mr-2 h-5 w-5" />
                          Repertorio
                        </h3>
                        <p className="mb-4">
                          ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
                          Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
                        </p>
                      </div>

                      {/* Logística y equipamiento */}
                      <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center">
                          <MapPin className="mr-2 h-5 w-5" />
                          Logística y equipamiento
                        </h3>
                        <p className="mb-4">
                          ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
                          Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          {artist.equipment?.map((item, index) => (
                            <UIBadge key={index} variant="outline" className="py-2 px-4 bg-white dark:bg-vyba-dark-secondary">
                              {item}
                            </UIBadge>
                          ))}
                        </div>
                      </div>

                      {/* Tiempos */}
                      <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center">
                          <Clock className="mr-2 h-5 w-5" />
                          Tiempos
                        </h3>
                        <p className="mb-4">
                          ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
                          Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          {artist.timeRequirements?.map((req, index) => (
                            <UIBadge key={index} variant="outline" className="py-2 px-4 bg-white dark:bg-vyba-dark-secondary">
                              {req}
                            </UIBadge>
                          ))}
                        </div>
                      </div>

                      {/* Formación */}
                      <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center">
                          <Badge className="mr-2 h-5 w-5" />
                          Formación
                        </h3>
                        <p className="mb-4">
                          ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
                          Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          {artist.education?.map((edu, index) => (
                            <UIBadge key={index} variant="outline" className="py-2 px-4 bg-white dark:bg-vyba-dark-secondary">
                              {edu}
                            </UIBadge>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>
            
            {/* Right Sticky Content */}
            <div className="lg:sticky lg:top-24 h-fit bg-white dark:bg-vyba-dark-bg rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-neutral-500" />
                <p className="text-lg text-neutral-600 dark:text-neutral-300">{artist.location} · {artist.availability}</p>
              </div>
              
              <h3 className="text-3xl font-black mb-6">{artist.priceRange}</h3>
              
              <Button 
                className="w-full py-6 text-lg font-bold mb-4"
                onClick={handleContact}
              >
                Contactar con {artist.name}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArtistProfilePage;
