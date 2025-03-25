import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Flag, Share2, MapPin, ChevronDown, Book, List, Clock, Badge, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MUSIC_GENRES } from "@/constants/music";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ArtistsList from "@/components/ArtistsList";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const artistsData = [{
  id: "1",
  name: "Antonia Pedragosa",
  type: "DJ",
  description: "¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado! Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨ Con años de experiencia y un repertorio cautivador, puedo crear la atmósfera perfecta para tu ocasión especial. Ya sea una boda íntima, una fiesta corporativa o una velada romántica, mi música te transportará a un mundo lleno de melodías irresistibles.",
  genres: ["Pop", "House", "Reggaeton", "Comercial"],
  location: "Barcelona",
  availability: "Esta semana disponible",
  images: ["/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png", "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png", "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png", "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png"],
  coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
  rating: 4.5,
  reviews: 34,
  priceRange: "150-400€",
  isFavorite: false,
  experience: ["TotKfe - Caldes de Montbui", "TotKfe - Caldes de Montbui", "TotKfe - Caldes de Montbui"],
  equipment: ["Con equipo propio", "Para <100 personas"],
  timeRequirements: ["10-15 minutos de prueba de sonido", "1h de montaje"],
  education: ["Conservatorio Provincial de Música Luis Gianneo"],
  musicPreviews: [{
    title: "Set 30 min musica urbana",
    duration: "30:45",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000"
  }, {
    title: "Mix pop comercial",
    duration: "45:20",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000"
  }],
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
  }]
}, {
  id: "2",
  name: "Antonia Pedragosa",
  type: "DJ",
  description: "DJ para todo tipo de eventos",
  images: ["/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png"],
  coverImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
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
  images: ["/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png", "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png", "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png"],
  coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
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

export const ArtistProfilePage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const artist = artistsData.find(artist => artist.id === id);
  if (!artist) {
    return <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <h1 className="text-2xl font-bold mb-4">Artista no encontrado</h1>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>
        <Footer />
      </>;
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
    // Aquí podríamos navegar a una página de búsqueda filtrada por género
    // navigate(`/artistas?genero=${genre}`);
  };
  const handleEventTypeClick = (eventType: string) => {
    toast.success(`Buscando artistas para ${eventType}`, {
      position: "bottom-center"
    });
    // Aquí podríamos navegar a una página de búsqueda filtrada por tipo de evento
    // navigate(`/artistas?evento=${eventType}`);
  };
  return <>
      <Navbar />
      <div className="px-6 md:px-10 lg:px-14 xl:px-16">
        {/* Banner Section with Blurred Background */}
        <div className="relative w-full h-[95vh] md:h-[calc(80vh)] overflow-hidden rounded-[25px] lg:rounded-[35px] mb-12">
          {/* Blurred background image - Capa base */}
          <div className="absolute inset-0 w-full h-full overflow-visible flex justify-center items-center" style={{
          zIndex: 0
        }}>
            <div className="absolute w-[120%] h-[120%] opacity-70">
              <img src={artist.coverImage} alt="" className="w-full h-full object-cover scale-150 filter blur-3xl" />
            </div>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>          
          {/* Main Banner Image - Capa principal */}
          <div className="relative z-10 w-full h-full">
            <img src={artist.coverImage} alt={`${artist.name} portada`} className="w-full h-full object-cover rounded-[25px] lg:rounded-[35px]" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </div>
          
          {/* Buttons in top right corner */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex space-x-2 z-20">
            <Button variant="secondary" size="icon" className="w-10 h-10 rounded-full" onClick={handleFavorite}>
              <Heart className="h-5 w-5 text-black dark:text-white" />
            </Button>
            <Button variant="secondary" size="icon" className="w-10 h-10 rounded-full" onClick={handleReport}>
              <Flag className="h-5 w-5 text-black dark:text-white" />
            </Button>
            <Button variant="secondary" size="icon" className="w-10 h-10 rounded-full" onClick={handleShare}>
              <Share2 className="h-5 w-5 text-black dark:text-white" />
            </Button>
          </div>
          
          {/* Artist info overlay */}
          {isMobile ? <div className="absolute bottom-12 left-5 right-0 flex flex-col items-start z-20">
              <div className="rounded-full overflow-hidden mb-4 w-24 h-24">
                <img src={artist.images[0]} alt={artist.name} className="w-full h-full object-cover rounded-full" />
              </div>
              
              <div className="text-white space-y-2 max-w-[85%]">
                <h1 className="text-2xl font-black truncate">{artist.name}</h1>
                <p className="text-lg opacity-90 line-clamp-2">{artist.type}</p>
              </div>
            </div> : <div className="absolute bottom-12 left-5 md:left-10 lg:left-14 flex items-center z-20">
              <div className="rounded-full overflow-hidden mr-4 md:mr-6 w-24 h-24 md:w-32 md:h-32">
                <img src={artist.images[0]} alt={artist.name} className="w-full h-full object-cover rounded-full" />
              </div>
              
              <div className="text-white space-y-4 max-w-[80%]">
                <h1 className="text-3xl md:text-5xl font-black truncate">{artist.name}</h1>
                <p className="text-xl md:text-2xl opacity-90 line-clamp-2">{artist.type}</p>
              </div>
            </div>}
        </div>

        {/* About Me Section */}
        <div className="pb-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-black mb-6">Sobre mi</h2>
              <p className="text-base mb-5 leading-relaxed">
                {artist.description}
              </p>
              
              {/* Genres - Convertidos a botones */}
              <div className="flex flex-wrap gap-3 mb-10">
                {artist.genres?.map((genre, index) => <Button key={index} variant="secondary" className="rounded-full text-sm font-medium" onClick={() => handleGenreClick(genre)}>
                    {genre}
                  </Button>)}
              </div>

              {/* Más información Section */}
              <div className="mt-8 mb-12">
                <h2 className="text-3xl font-black mb-6">Más información</h2>
                <div className="bg-secondary dark:bg-vyba-dark-secondary/70 rounded-3xl overflow-hidden">
                  <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen} className="w-full">
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-between w-full p-8 text-sm bg-secondary font-bold hover:bg-secondary/80 dark:bg-vyba-dark-secondary/70 dark:hover:bg-vyba-dark-secondary/90 transition-colors duration-200">
                        <span>Experiencia, Repertorio, Logística y Equipamiento, Tiempos</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-500 ${isInfoOpen ? "rotate-180" : ""}`} />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-8 pt-0 space-y-8 bg-secondary rounded-lg rounded-tr-none rounded-tl-none dark:bg-vyba-dark-secondary/70">
                      {/* Experiencia */}
                      <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center">
                          Experiencia
                        </h3>
                        <p className="mb-4">
                          ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
                          Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          {artist.experience?.map((exp, index) => {
                          // Dividir la experiencia en nombre y ubicación (asumiendo formato "Nombre - Ubicación")
                          const parts = exp.split(' - ');
                          const name = parts[0];
                          const location = parts.length > 1 ? parts[1] : '';
                          return <UIBadge key={index} variant="outline" className="py-2 px-4 bg-white border-0 text-sm font-medium dark:bg-vyba-dark-secondary">
                                <span className="text-black dark:text-white">{name}</span>
                                {location && <>
                                    <span className="mx-1 text-gray-500">·</span>
                                    <span className="text-gray-500">{location}</span>
                                  </>}
                              </UIBadge>;
                        })}
                        </div>
                      </div>

                      {/* Repertorio */}
                      <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center">
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
                          Logística y equipamiento
                        </h3>
                        <p className="mb-4">
                          ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
                          Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          {artist.equipment?.map((item, index) => <UIBadge key={index} variant="outline" className="py-2 px-4 bg-white border-0 text-sm font-medium flex items-center gap-2 dark:bg-vyba-dark-secondary">
                              <List className="w-4 h-4" />                              
                              {item}
                            </UIBadge>)}
                        </div>
                      </div>

                      {/* Tiempos */}
                      <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center">
                          Tiempos
                        </h3>
                        <p className="mb-4">
                          ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
                          Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          {artist.timeRequirements?.map((req, index) => <UIBadge key={index} variant="outline" className="py-2 px-4 bg-white border-0 text-sm font-medium flex items-center gap-2 dark:bg-vyba-dark-secondary">
                              <Clock className="w-4 h-4" />
                              {req}
                            </UIBadge>)}
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
                          {artist.education?.map((edu, index) => <UIBadge key={index} variant="outline" className="py-2 px-4 bg-white border-0 text-sm font-medium flex items-center gap-2 dark:bg-vyba-dark-secondary">
                              <Book className="w-4 h-4" />
                              {edu}
                            </UIBadge>)}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>

              {/* Sección de Preview Musical */}
              <div className="mt-8 mb-16">
                <h2 className="text-3xl font-black mb-6">Preview</h2>
                <div className="space-y-4">
                  {artist.musicPreviews?.map((preview, index) => (
                    <div 
                      key={index} 
                      className="group flex items-center gap-4 p-2 bg-secondary dark:bg-vyba-dark-secondary/70 rounded-2xl hover:bg-opacity-80 transition-colors duration-200 cursor-pointer hover:bg-secondary/90 dark:hover:bg-vyba-dark-secondary/90 relative"
                    >
                      <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={preview.image} 
                          alt={preview.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        />
                        
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 text-primary-foreground ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-base font-bold">{preview.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{artist.name}</p>
                      </div>
                      <div className="text-right mr-4">
                        <span className="text-sm font-medium">{preview.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nueva sección de Tipos de Eventos */}
              <div className="mt-8 mb-16">
                <h2 className="text-3xl font-black mb-6">Tipos de Eventos</h2>
                <div className="flex flex-wrap gap-3">
                  {artist.eventTypes?.map((eventType, index) => <Button key={index} variant="secondary" className="rounded-full text-sm font-medium" onClick={() => handleEventTypeClick(eventType)}>
                      {eventType}
                    </Button>)}
                </div>
              </div>

              {/* Nueva sección de FAQ */}
              <div className="mt-8 mb-16">
                <h2 className="text-3xl font-black mb-6">FAQ</h2>
                <Accordion type="single" collapsible className="bg-secondary dark:bg-vyba-dark-secondary/70 rounded-3xl overflow-hidden">
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="px-8 py-6 text-sm font-bold">
                      ¿Cómo puedo reservar una fecha?
                    </AccordionTrigger>
                    <AccordionContent className="px-8 text-base">
                      Para reservar una fecha con {artist.name}, simplemente haz clic en el botón "Contactar" y nuestro equipo te ayudará a coordinar los detalles de tu evento. Asegúrate de proporcionar toda la información relevante como fecha, ubicación y tipo de evento.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-b-0">
                    <AccordionTrigger className="px-8 py-6 text-sm font-bold">
                      ¿Qué incluye el precio?
                    </AccordionTrigger>
                    <AccordionContent className="px-8 text-base">
                      El precio incluye la actuación completa de {artist.name}, equipo de sonido básico para espacios pequeños y una consulta previa al evento para discutir tus preferencias musicales. Cualquier requisito adicional se cotizará por separado.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-b-0">
                    <AccordionTrigger className="px-8 py-6 text-sm font-bold">
                      ¿Cuánto tiempo dura una actuación?
                    </AccordionTrigger>
                    <AccordionContent className="px-8 text-base">
                      Las actuaciones estándar suelen durar entre 2 y 3 horas, con descansos breves. Sin embargo, podemos adaptar la duración según las necesidades específicas de tu evento.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border-b-0">
                    <AccordionTrigger className="px-8 py-6 text-sm font-bold">
                      ¿Puedo solicitar canciones específicas?
                    </AccordionTrigger>
                    <AccordionContent className="px-8 text-base">
                      ¡Por supuesto! Puedes proporcionar una lista de canciones que te gustaría escuchar y haremos todo lo posible para incluirlas en el repertorio. Recomendamos compartir estas solicitudes con al menos dos semanas de anticipación.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5" className="border-b-0">
                    <AccordionTrigger className="px-8 py-6 text-sm font-bold">
                      ¿Qué pasa si necesito cancelar?
                    </AccordionTrigger>
                    <AccordionContent className="px-8 text-base">
                      Nuestra política de cancelación requiere un aviso con 30 días de anticipación para un reembolso completo. Las cancelaciones con menos tiempo pueden estar sujetas a cargos parciales. Cada caso se evalúa individualmente.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6" className="border-b-0">
                    <AccordionTrigger className="px-8 py-6 text-sm font-bold">
                      ¿Cómo funciona el pago?
                    </AccordionTrigger>
                    <AccordionContent className="px-8 text-base">
                      Requerimos un depósito del 50% para confirmar la reserva, y el saldo restante debe pagarse una semana antes del evento. Aceptamos transferencias bancarias y otros métodos de pago que se acordarán al momento de la reserva.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Nueva sección de Reseñas - Rediseñada según la imagen */}
              <div className="mt-8 mb-16">
                <h2 className="text-3xl font-black mb-3">Reseñas</h2>
                <div className="space-y-6">
                  {/* Rating summary */}
                  <div className="flex flex-wrap items-center gap-6 mb-8 justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-medium">{artist.rating}</span>
                      <span className="text-3xl font-medium">({artist.reviews})</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {artist.genres?.filter((_, i) => i < 2).map((genre, index) => (
                        <UIBadge key={index} variant="outline" className="py-2 px-4 bg-white border-0 text-sm font-medium flex items-center gap-2 dark:bg-vyba-dark-secondary">
                          {genre}
                        </UIBadge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Individual reviews - Rediseñadas según la imagen */}
                  <div className="space-y-10">
                    {artist.reviewsData?.map(review => (
                      <div key={review.id} className="pb-8 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex gap-6">
                          {/* Parte izquierda: Imagen de perfil e información básica */}
                          <div className="w-[90px] flex-shrink-0">
                            <div className="w-[72px] h-[72px] rounded-[16px] overflow-hidden mb-2">
                              <img 
                                src={review.id === 1 ? "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000" : 
                                     review.id === 2 ? "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000" :
                                                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000"} 
                                alt={review.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-left">
                              <h4 className="text-sm font-bold">{review.name}</h4>
                              <p className="text-xs text-gray-500">hace {review.date}</p>
                            </div>
                          </div>
                          
                          {/* Parte derecha: Estrellas y comentario */}
                          <div className="flex-1">
                            {/* Estrellas en fila - 5 estrellas con la cantidad correspondiente llenas */}
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, index) => (
                                <Star 
                                  key={index} 
                                  className={`h-5 w-5 ${index < review.rating ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 dark:text-gray-600"}`}
                                />
                              ))}
                            </div>
                            
                            {/* Comentario de la reseña */}
                            <p className="text-base">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Ver todas button */}
                  <div className="flex justify-center mt-8">
                    <Button variant="secondary" className="px-12">
                      Ver todas
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Sticky Content */}
            <div className="lg:sticky lg:top-24 h-fit bg-white dark:bg-vyba-dark-bg rounded-3xl px-6 py-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-base text-neutral-600 dark:text-neutral-300">{artist.location} · {artist.availability}</p>
              </div>
              
              <h3 className="text-lg font-black mb-6">{artist.priceRange}</h3>
              <Separator className="-mx-6 w-[calc(100%+48px)]" />
              
              <Button className="w-full py-4 text-base font-bold mt-6" onClick={handleContact}>
                Contactar con {artist.name}
              </Button>
            </div>
          </div>
        </div>

        {/* Nueva sección de Recomendados con carrusel básico */}
        <div className="mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black mb-6">Recomendados</h2>
          </div>
          <div className="relative max-w-full mx-auto">
            <Carousel 
              opts={{
                align: "start",
                loop: false
              }} 
              className="max-w-7xl mx-auto"
            >
              <CarouselContent>
                {recommendedArtists.map(artist => (
                  <CarouselItem 
                    key={artist.id} 
                    className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <ArtistProfileCard 
                      name={artist.name} 
                      type={artist.type} 
                      description={artist.description} 
                      images={artist.images} 
                      rating={artist.rating} 
                      priceRange={artist.priceRange} 
                      isFavorite={artist.isFavorite} 
                      onClick={() => navigate(`/artista/${artist.id}`)} 
                      onFavoriteToggle={() => {
                        toast.success(artist.isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos", {
                          icon: artist.isFavorite ? "👋" : "❤️",
                          position: "bottom-center"
                        });
                      }} 
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </div>
      </div>
      <Footer />
    </>;
};

