
import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
                className={`h-5 w-5 ${index < review.rating 
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

const ArtistReviews = ({ rating, reviews, genres, reviewsData }: ArtistReviewsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Reseñas</DialogTitle>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-medium">{rating}</span>
              <span className="text-3xl font-medium">({reviews})</span>
            </div>
          </DialogHeader>

          <div className="space-y-8 mt-4">
            {reviewsData?.map(review => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistReviews;
