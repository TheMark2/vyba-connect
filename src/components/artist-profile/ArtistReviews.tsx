
import React, { useState, useEffect } from "react";
import { Star, ClockAlert, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  badges: string[];
  comment: string;
  title?: string;
  reply?: {
    name: string;
    date: string;
    comment: string;
  };
}
interface ArtistReviewsProps {
  rating: number;
  reviews: number;
  genres?: string[];
  reviewsData?: Review[];
}
const ReviewItem = ({
  review
}: {
  review: Review;
}) => {
  const isMobile = useIsMobile();
  const handleReportClick = () => {
    toast.info("Reseña reportada", {
      description: "Gracias por informarnos",
      position: "bottom-center"
    });
  };
  
  // Determine if the name is too long (more than 15 characters)
  const isNameLong = review.name.length > 15;
  return <div className="mb-10">
      <div className="bg-[#F7F7F7] rounded-3xl p-6 relative">
        <div className="absolute top-6 right-6 flex gap-2">
          <Button variant="default" size="icon" className="h-8 w-8" onClick={handleReportClick}>
            <CornerDownRight className="h-4 w-4 stroke-[2.5px]" />
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/4">
            <div className="flex items-center mb-2">
              <Avatar className="h-16 w-16 rounded-lg mr-3">
                <AvatarImage src={review.id === 1 ? "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000" : review.id === 2 ? "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000" : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000"} alt={review.name} />
                <AvatarFallback className="rounded-lg">{review.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                {isNameLong ? <h4 className="text-base font-bold w-28 overflow-hidden text-ellipsis whitespace-nowrap">
                    {review.name}
                  </h4> : <h4 className="text-base font-bold">{review.name}</h4>}
                <p className="text-sm">hace {review.date}</p>
              </div>
            </div>
            
            <div className="flex items-center mt-3">
              {[...Array(5)].map((_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 dark:text-gray-600"}`} />)}
            </div>
          </div>
          
          <div className="md:w-3/4">
            <h3 className="text-xl font-bold mb-4">{review.title || "Muy buen servicio"}</h3>
            <p className="text-base">{review.comment}</p>
          </div>
        </div>
      </div>
      
      {review.reply && <div className="bg-[#D9D9D9] rounded-3xl p-6 ml-8 md:ml-16 mt-3">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div>
                {review.reply.name.length > 15 ? <h4 className="text-base font-bold w-28 overflow-hidden text-ellipsis whitespace-nowrap">
                    {review.reply.name}
                  </h4> : <h4 className="text-base font-bold">{review.reply.name}</h4>}
                <p className="text-sm">hace {review.reply.date}</p>
              </div>
            </div>
            
            <div className="md:w-3/4">
              <div className="flex items-start gap-2">
                <p className="text-base">{review.reply.comment}</p>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
const moreReviewsData: Review[] = [{
  id: 4,
  name: "Miguel López",
  date: "2 semanas",
  rating: 5,
  badges: ["Bodas", "Eventos corporativos"],
  comment: "¡Increíble actuación! Todos mis invitados quedaron encantados con su música. Definitivamente lo volvería a contratar para futuros eventos.",
  title: "Excelente profesional",
  reply: {
    name: "Antonia Pedragosa",
    date: "2 semanas",
    comment: "Muchas gracias por tus amables palabras, Miguel. Fue un placer amenizar tu evento. ¡Espero volver a trabajar contigo pronto!"
  }
}, {
  id: 5,
  name: "Laura Gómez",
  date: "1 mes",
  rating: 4,
  badges: ["Bodas", "Fiestas privadas"],
  comment: "Muy profesional y puntual. La música fue perfecta para nuestra celebración de aniversario. Recomendado.",
  title: "Muy profesional"
}, {
  id: 6,
  name: "Carlos Martínez",
  date: "2 meses",
  rating: 5,
  badges: ["Eventos corporativos"],
  comment: "Contratar a este artista fue la mejor decisión para nuestro evento corporativo. Su repertorio se adaptó perfectamente a nuestras necesidades.",
  title: "Repertorio adaptado a nuestras necesidades",
  reply: {
    name: "Antonia Pedragosa",
    date: "2 meses",
    comment: "Gracias Carlos, me alegra que quedaran satisfechos con mi servicio. Fue un placer trabajar en su evento corporativo."
  }
}, {
  id: 7,
  name: "Sofía Rodríguez",
  date: "3 meses",
  rating: 4,
  badges: ["Bodas"],
  comment: "Nuestra boda fue especial gracias a su música. El ambiente que creó fue exactamente lo que buscábamos.",
  title: "Creó el ambiente perfecto"
}, {
  id: 8,
  name: "David García",
  date: "4 meses",
  rating: 5,
  badges: ["Fiestas privadas"],
  comment: "Un profesional excepcional. Su energía contagió a todos los invitados y la fiesta fue un éxito rotundo.",
  title: "Energía contagiosa"
}];
const ArtistReviews = ({
  rating,
  reviews,
  genres,
  reviewsData
}: ArtistReviewsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsDialogOpen(false);
      setIsBottomSheetOpen(false);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Añadir respuestas a algunas reseñas existentes
  const enhancedReviewsData = reviewsData?.map(review => {
    if (review.id === 1) {
      return {
        ...review,
        title: "Muy buen servicio",
        reply: {
          name: "Antonia Pedragosa",
          date: "3 días",
          comment: "Muchas gracias, fue un placer acompañarte"
        }
      };
    }
    return {
      ...review,
      title: review.id === 2 ? "Excelente ambiente" : "Gran profesional"
    };
  });
  const allReviews = enhancedReviewsData ? [...enhancedReviewsData, ...moreReviewsData] : [];
  const handleWriteReview = () => {
    toast.success("Función escribir reseña", {
      description: "Esta función estará disponible próximamente",
      position: "bottom-center"
    });
  };

  const handleVerTodas = () => {
    if (isMobile) {
      setIsBottomSheetOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };
  
  return <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-3">Reseñas</h2>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-6 mb-8 justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium">{rating}</span>
            <span className="text-3xl font-medium">({reviews})</span>
          </div>
          <div>
            <Button variant="secondary" className="flex items-center gap-2" onClick={handleWriteReview}>
              <CornerDownRight className="h-4 w-4 stroke-[2.5px]" />
              Escribir una reseña
            </Button>
          </div>
        </div>
        
        <div className="space-y-12">
          {enhancedReviewsData?.slice(0, 3).map(review => <ReviewItem key={review.id} review={review} />)}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="secondary" className="px-12" onClick={handleVerTodas}>
            Ver todas
          </Button>
        </div>
      </div>

      {/* Diálogo para escritorio */}
      {!isMobile && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] p-6 border-none bg-white dark:bg-vyba-dark-bg rounded-[40px] pt-8 px-8 pb-0">
            <DialogHeader className="text-left mb-6">
              <DialogTitle className="text-3xl font-black">Reseñas</DialogTitle>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-medium">{rating}</span>
                <span className="text-3xl font-medium">({allReviews.length})</span>
              </div>
            </DialogHeader>

            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-12">
                {allReviews.map(review => <ReviewItem key={review.id} review={review} />)}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {/* Bottom Sheet para móvil */}
      {isMobile && (
        <SwipeableBottomSheet
          overflowHeight={0}
          marginTop={64}
          open={isBottomSheetOpen}
          onChange={setIsBottomSheetOpen}
          fullScreen={false}
          topShadow={false}
          shadowTip={false}
          bodyStyle={{ 
            borderTopLeftRadius: '24px', 
            borderTopRightRadius: '24px',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div className="px-6 py-6">
            <div className="flex justify-center w-full mb-3">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            <h2 className="text-3xl font-black mb-3">Reseñas</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-medium">{rating}</span>
              <span className="text-3xl font-medium">({allReviews.length})</span>
            </div>
            
            <ScrollArea className="h-[calc(70vh-150px)] pr-4">
              <div className="space-y-12">
                {allReviews.map(review => <ReviewItem key={review.id} review={review} />)}
              </div>
            </ScrollArea>
          </div>
        </SwipeableBottomSheet>
      )}
    </div>;
};
export default ArtistReviews;
