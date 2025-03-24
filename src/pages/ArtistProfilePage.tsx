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
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const artist = artistsData.find(artist => artist.id === id);



