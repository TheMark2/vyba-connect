
import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  badges: string[];
  comment: string;
}

interface ArtistReviewsProps {
  rating: number;
  reviews: number;
  genres?: string[];
  reviewsData?: Review[];
}

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <div className="pb-8 border-b border-gray-200 dark:border-gray-700">
      <div className="flex gap-6">
        {/* Parte izquierda: Imagen de perfil e información básica */}
        <div className="w-[90px] flex-shrink-0">
          <div className="w-[72px] h-[72px] rounded-[16px] overflow-hidden mb-2">
            <img 
              src={review.id === 1 
                ? "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000" 
                : review.id === 2 
                  ? "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000" 
                  : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000"
              } 
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
                className={`h-4 w-4 ${index < review.rating 
                  ? "text-black fill-black dark:text-white dark:fill-white" 
                  : "text-gray-300 dark:text-gray-600"}`} 
              />
            ))}
          </div>
          
          {/* Comentario de la reseña */}
          <p className="text-base">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

// Datos de ejemplo para reseñas adicionales
const moreReviewsData: Review[] = [
  {
    id: 4,
    name: "Miguel López",
    date: "2 semanas",
    rating: 5,
    badges: ["Bodas", "Eventos corporativos"],
    comment: "¡Increíble actuación! Todos mis invitados quedaron encantados con su música. Definitivamente lo volvería a contratar para futuros eventos."
  },
  {
    id: 5,
    name: "Laura Gómez",
    date: "1 mes",
    rating: 4,
    badges: ["Bodas", "Fiestas privadas"],
    comment: "Muy profesional y puntual. La música fue perfecta para nuestra celebración de aniversario. Recomendado."
  },
  {
    id: 6,
    name: "Carlos Martínez",
    date: "2 meses",
    rating: 5,
    badges: ["Eventos corporativos"],
    comment: "Contratar a este artista fue la mejor decisión para nuestro evento corporativo. Su repertorio se adaptó perfectamente a nuestras necesidades."
  },
  {
    id: 7,
    name: "Sofía Rodríguez",
    date: "3 meses",
    rating: 4,
    badges: ["Bodas"],
    comment: "Nuestra boda fue especial gracias a su música. El ambiente que creó fue exactamente lo que buscábamos."
  },
  {
    id: 8,
    name: "David García",
    date: "4 meses",
    rating: 5,
    badges: ["Fiestas privadas"],
    comment: "Un profesional excepcional. Su energía contagió a todos los invitados y la fiesta fue un éxito rotundo."
  }
];

const ArtistReviews = ({ rating, reviews, genres, reviewsData }: ArtistReviewsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Combinamos las reseñas existentes con las adicionales para el diálogo
  const allReviews = reviewsData ? [...reviewsData, ...moreReviewsData] : [];

  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-3">Reseñas</h2>
      <div className="space-y-6">
        {/* Rating summary */}
        <div className="flex flex-wrap items-center gap-6 mb-8 justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium">{rating}</span>
            <span className="text-3xl font-medium">({reviews})</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {genres?.filter((_, i) => i < 2).map((genre, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="py-2 px-4 bg-white border-0 text-sm font-medium flex items-center gap-2 dark:bg-vyba-dark-secondary"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Individual reviews (mostrar solo los primeros 3 en la vista principal) */}
        <div className="space-y-10">
          {reviewsData?.slice(0, 3).map(review => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
        
        {/* Ver todas button */}
        <div className="flex justify-center mt-8">
          <Button 
            variant="secondary" 
            className="px-12"
            onClick={() => setIsDialogOpen(true)}
          >
            Ver todas
          </Button>
        </div>
      </div>

      {/* Dialog para mostrar todas las reseñas */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] border-none bg-vyba-cream dark:bg-vyba-dark-bg rounded-[30px] pt-8 px-8 pb-0">
          <DialogHeader className="relative">
            <DialogTitle className="text-3xl font-black">Reseñas</DialogTitle>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-medium">{rating}</span>
              <span className="text-3xl font-medium">({allReviews.length})</span>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[60vh] mt-4 pr-4">
            <div className="space-y-8">
              {allReviews.map(review => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistReviews;
