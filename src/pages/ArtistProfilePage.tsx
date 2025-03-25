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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const artist = artistsData.find((artist) => artist.id === id);

  if (!artist) {
    return <div>Artista no encontrado</div>;
  }

  const [isFavorite, setIsFavorite] = useState(artist.isFavorite);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos", {
      icon: isFavorite ? "👋" : "❤️",
      duration: 2000,
      position: "bottom-center"
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="md:col-span-2">
            {/* Sección de cabecera con imagen de portada y detalles */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={artist.coverImage}
                alt={`Cover de ${artist.name}`}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold">{artist.name}</h1>
                <p className="text-sm">{artist.type}</p>
              </div>
              <Button variant="secondary" className="absolute top-4 right-4">
                Contratar
              </Button>
            </div>

            {/* Sección de descripción */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Acerca de</h2>
              <p className="text-gray-700 dark:text-gray-300">{artist.description}</p>
            </div>

            {/* Carrusel de imágenes */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Galería</h2>
              <Carousel className="w-full">
                <CarouselContent>
                  {artist.images.map((image, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <img
                        src={image}
                        alt={`${artist.name} - ${index + 1}`}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* Sección de música (si aplica) */}
            {artist.musicPreviews && artist.musicPreviews.length > 0 && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Música</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artist.musicPreviews.map((music, index) => (
                    <div key={index} className="rounded-md overflow-hidden shadow-md">
                      <img
                        src={music.image}
                        alt={`Preview de ${music.title}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold">{music.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Duración: {music.duration}</p>
                        <Button variant="outline" className="mt-2">
                          <Play className="mr-2 h-4 w-4" />
                          Escuchar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acordeón con detalles adicionales */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Más detalles</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="event-types">
                  <AccordionTrigger>Tipos de Evento</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5">
                      {artist.eventTypes && artist.eventTypes.map((type, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{type}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="experience">
                  <AccordionTrigger>Experiencia</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5">
                      {artist.experience && artist.experience.map((exp, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{exp}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="equipment">
                  <AccordionTrigger>Equipamiento</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5">
                      {artist.equipment && artist.equipment.map((eq, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{eq}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                {artist.timeRequirements && (
                  <AccordionItem value="time-requirements">
                    <AccordionTrigger>Requisitos de Tiempo</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5">
                        {artist.timeRequirements.map((req, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {artist.education && (
                  <AccordionItem value="education">
                    <AccordionTrigger>Educación</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5">
                        {artist.education.map((edu, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{edu}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {artist.reviewsData && (
                  <AccordionItem value="reviews">
                    <AccordionTrigger>Reseñas</AccordionTrigger>
                    <AccordionContent>
                      {artist.reviewsData.map((review, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="mr-2">
                                <AvatarImage src="/placeholder-avatar.jpg" alt={review.name} />
                                <AvatarFallback>{review.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="text-sm font-medium">{review.name}</div>
                            </div>
                            <div className="text-xs text-gray-500">{review.date}</div>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>

          {/* Columna lateral */}
          <div className="md:col-span-1">
            <ArtistProfileCard
              name={artist.name}
              type={artist.type}
              description={artist.description}
              images={artist.images}
              rating={artist.rating}
              priceRange={artist.priceRange}
              isFavorite={isFavorite}
              onFavoriteToggle={toggleFavorite}
            />
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Artistas Similares</h2>
              <ArtistsList artists={recommendedArtists} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
