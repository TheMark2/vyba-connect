
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

const ArtistProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Encontrar el artista correspondiente al ID
  const artist = artistsData.find(artist => artist.id === id) || artistsData[0];
  
  // Estado para controlar si el artista está marcado como favorito
  const [isFavorite, setIsFavorite] = useState(artist.isFavorite);
  
  // Función para manejar el clic en el botón de favorito
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos");
  };
  
  // Función para manejar el clic en el botón de compartir
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Enlace copiado al portapapeles");
  };
  
  // Función para manejar el clic en el botón de reportar
  const handleReportClick = () => {
    toast.info("Reporte enviado. Gracias por tu feedback.");
  };
  
  return (
    <div className="bg-[#FDFBF9] dark:bg-vyba-dark-bg min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Contenido principal */}
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Sección de cabecera con imagen de portada */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden mb-8">
          <img 
            src={artist.coverImage} 
            alt={artist.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Información básica superpuesta en la imagen */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={artist.images[0]} alt={artist.name} />
                <AvatarFallback>{artist.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{artist.name}</h1>
                <p className="text-white/80">{artist.type}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenido en dos columnas para escritorio, una columna para móvil */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información detallada */}
          <div className="lg:col-span-2 space-y-8">
            {/* Barra de acciones */}
            <div className="flex items-center justify-between bg-white dark:bg-vyba-dark-secondary p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={handleFavoriteClick}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={handleShareClick}
                >
                  <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={handleReportClick}
                >
                  <Flag className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Button>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">{artist.rating}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">({artist.reviews || '0'} reseñas)</span>
              </div>
            </div>
            
            {/* Descripción */}
            <div className="bg-white dark:bg-vyba-dark-secondary p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Descripción</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{artist.description}</p>
              
              {/* Géneros musicales */}
              {artist.genres && artist.genres.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 dark:text-white">Géneros musicales</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.genres.map((genre, index) => (
                      <UIBadge key={index} variant="secondary" className="rounded-full bg-[#F0E5D8] hover:bg-[#E7D3D3] text-black">
                        {genre}
                      </UIBadge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Ubicación y disponibilidad */}
              <div className="mt-6 flex flex-wrap gap-6">
                {artist.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{artist.location}</span>
                  </div>
                )}
                
                {artist.availability && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{artist.availability}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Galería de imágenes */}
            <div className="bg-white dark:bg-vyba-dark-secondary p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {artist.images.slice(0, 6).map((image, index) => (
                  <div 
                    key={index} 
                    className="aspect-square rounded-xl overflow-hidden"
                  >
                    <img 
                      src={image} 
                      alt={`${artist.name} - Imagen ${index + 1}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Música y grabaciones */}
            {artist.musicPreviews && artist.musicPreviews.length > 0 && (
              <div className="bg-white dark:bg-vyba-dark-secondary p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Música y grabaciones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artist.musicPreviews.map((preview, index) => (
                    <div 
                      key={index} 
                      className="group relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
                    >
                      <div className="flex items-center p-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4">
                          <img 
                            src={preview.image} 
                            alt={preview.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium dark:text-white">{preview.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{preview.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Detalles acordeón */}
            <Accordion type="single" collapsible className="bg-white dark:bg-vyba-dark-secondary rounded-2xl shadow-sm">
              {/* Experiencia */}
              {artist.experience && artist.experience.length > 0 && (
                <AccordionItem value="experience" className="border-b border-gray-200 dark:border-gray-700">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center">
                      <Book className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold dark:text-white">Experiencia</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <ul className="space-y-2">
                      {artist.experience.map((exp, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{exp}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {/* Equipamiento */}
              {artist.equipment && artist.equipment.length > 0 && (
                <AccordionItem value="equipment" className="border-b border-gray-200 dark:border-gray-700">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center">
                      <List className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold dark:text-white">Equipamiento</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <ul className="space-y-2">
                      {artist.equipment.map((equip, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{equip}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {/* Requerimientos de tiempo */}
              {artist.timeRequirements && artist.timeRequirements.length > 0 && (
                <AccordionItem value="timeRequirements" className="border-b border-gray-200 dark:border-gray-700">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold dark:text-white">Requerimientos de tiempo</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <ul className="space-y-2">
                      {artist.timeRequirements.map((req, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {/* Formación */}
              {artist.education && artist.education.length > 0 && (
                <AccordionItem value="education" className="border-b-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center">
                      <Badge className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold dark:text-white">Formación</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <ul className="space-y-2">
                      {artist.education.map((edu, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{edu}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
            
            {/* Reseñas */}
            {artist.reviewsData && artist.reviewsData.length > 0 && (
              <div className="bg-white dark:bg-vyba-dark-secondary p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Reseñas</h2>
                <div className="space-y-6">
                  {artist.reviewsData.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{review.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium dark:text-white">{review.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Hace {review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {review.badges && review.badges.length > 0 && (
                        <div className="flex flex-wrap gap-2 my-2">
                          {review.badges.map((badge, index) => (
                            <UIBadge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                              {badge}
                            </UIBadge>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Columna derecha - Tarjeta de perfil y artistas similares */}
          <div className="space-y-8">
            {/* Tarjeta de perfil */}
            <ArtistProfileCard 
              priceRange={artist.priceRange}
              eventTypes={artist.eventTypes}
            />
            
            {/* Artistas similares */}
            <div className="bg-white dark:bg-vyba-dark-secondary p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Artistas similares</h2>
              <ArtistsList artists={recommendedArtists.slice(0, 3)} />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ArtistProfilePage;
