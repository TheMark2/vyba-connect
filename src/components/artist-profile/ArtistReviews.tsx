
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
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
  onBottomSheetChange?: (isOpen: boolean) => void;
}
const ReviewItem = ({
  review,
  isMobileCarousel = false
}: {
  review: Review;
  isMobileCarousel?: boolean;
}) => {
  const isMobile = useIsMobile();
  const handleReportClick = () => {
    toast.info("Reseña reportada", {
      description: "Gracias por informarnos",
      position: "bottom-center"
    });
  };
  const handleReminderClick = () => {
    toast.info("Revisaremos esta reseña pronto", {
      description: "Gracias por ayudarnos a mejorar",
      position: "bottom-center"
    });
  };
  const isNameLong = review.name.length > 15;

  // Si es para el carrusel móvil, usamos un diseño específico
  if (isMobileCarousel) {
    return (
      <div className="bg-white rounded-3xl p-6 h-full">
        {/* Botones en la esquina superior derecha */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button variant="outline" size="icon" className="h-8 w-8 bg-white" onClick={handleReminderClick}>
            <ClockAlert className="h-4 w-4 stroke-[2.5px]" />
          </Button>
          <Button variant="default" size="icon" className="h-8 w-8" onClick={handleReportClick}>
            <CornerDownRight className="h-4 w-4 stroke-[2.5px]" />
          </Button>
        </div>
        
        {/* Estrellas en la parte superior */}
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, index) => (
            <Star 
              key={index} 
              className={`h-3 w-3 ${index < review.rating ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 dark:text-gray-600"}`} 
            />
          ))}
        </div>
        
        {/* Título */}
        <h3 className="text-lg font-bold mb-3 pr-20">{review.title || "Muy buen servicio"}</h3>
        
        {/* Comentario */}
        <p className="text-base mb-6">{review.comment}</p>
        
        {/* Información del autor en la parte inferior */}
        <div className="flex items-center mt-auto">
          <Avatar className="h-10 w-10 rounded-full mr-3">
            <AvatarImage src={review.id === 1 ? "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000" : review.id === 2 ? "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000" : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000"} alt={review.name} />
            <AvatarFallback className="rounded-full">{review.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{review.name}</p>
            <p className="text-xs text-gray-500">hace {review.date}</p>
          </div>
        </div>
      </div>
    );
  }

  // Para PC, adaptamos el formato para que sea similar al móvil
  return <div className="mb-6">
      <div className="bg-[#F7F7F7] rounded-3xl p-6 relative">
        {/* Botones en la esquina superior derecha */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button variant="outline" size="icon" className="h-8 w-8 bg-white" onClick={handleReminderClick}>
            <ClockAlert className="h-4 w-4 stroke-[2.5px]" />
          </Button>
          <Button variant="default" size="icon" className="h-8 w-8" onClick={handleReportClick}>
            <CornerDownRight className="h-4 w-4 stroke-[2.5px]" />
          </Button>
        </div>
        
        <div className="flex flex-col">
          {/* Estrellas en la parte superior */}
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => (
              <Star 
                key={index} 
                className={`h-3 w-3 ${index < review.rating ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 dark:text-gray-600"}`} 
              />
            ))}
          </div>
          
          {/* Título */}
          <h3 className="text-lg font-bold mb-3 pr-20">{review.title || "Muy buen servicio"}</h3>
          
          {/* Comentario */}
          <p className="text-base mb-6">{review.comment}</p>
          
          {/* Información del autor en la parte inferior */}
          <div className="flex items-center mt-2">
            <Avatar className="h-10 w-10 rounded-full mr-3">
              <AvatarImage src={review.id === 1 ? "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000" : review.id === 2 ? "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000" : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000"} alt={review.name} />
              <AvatarFallback className="rounded-full">{review.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{review.name}</p>
              <p className="text-xs text-gray-500">hace {review.date}</p>
            </div>
          </div>
        </div>
      </div>
      
      {review.reply && <div className="bg-[#D9D9D9] rounded-3xl p-6 ml-8 mt-3">
          <div className="flex flex-col">
            <p className="text-base mb-4">{review.reply.comment}</p>
            
            <div className="flex items-center mt-2">
              <Avatar className="h-10 w-10 rounded-full mr-3">
                <AvatarFallback className="rounded-full">{review.reply.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{review.reply.name}</p>
                <p className="text-xs text-gray-500">hace {review.reply.date}</p>
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
  reviewsData,
  onBottomSheetChange
}: ArtistReviewsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (onBottomSheetChange) {
      onBottomSheetChange(isBottomSheetOpen);
    }
  }, [isBottomSheetOpen, onBottomSheetChange]);
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
      <div className={`${isMobile ? 'bg-[#F7F7F7] px-6 py-8 -mx-6' : ''}`}>
        <h2 className="text-3xl font-black mb-1">Reseñas</h2>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-6 mb-8 justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-medium">{rating}</span>
              <span className="text-2xl font-medium">({reviews})</span>
            </div>
            <div>
              <Button variant="secondary" className="flex items-center gap-2" onClick={handleWriteReview}>
                <CornerDownRight className="h-4 w-4 stroke-[2.5px]" />
                Escribir una reseña
              </Button>
            </div>
          </div>
          
          {/* Carousel for mobile devices */}
          {isMobile && (
            <div className="mb-10">
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2">
                  {allReviews.slice(0, 5).map((review) => (
                    <CarouselItem key={review.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
                      <div className="h-full">
                        <ReviewItem review={review} isMobileCarousel={true} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
          
          {/* Standard list for desktop */}
          {!isMobile && (
            <div className="space-y-6">
              {allReviews.slice(0, 3).map(review => <ReviewItem key={review.id} review={review} />)}
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <Button variant="secondary" className="px-12" onClick={handleVerTodas}>
              Ver todas
            </Button>
          </div>
        </div>
      </div>

      {!isMobile && <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] p-6 border-none bg-white dark:bg-vyba-dark-bg rounded-[40px] pt-8 px-8 pb-0">
            <DialogHeader className="text-left mb-6">
              <DialogTitle className="text-3xl font-black">Reseñas</DialogTitle>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-medium">{rating}</span>
                <span className="text-3xl font-medium">({allReviews.length})</span>
              </div>
            </DialogHeader>

            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                {allReviews.map(review => <ReviewItem key={review.id} review={review} />)}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>}

      {isMobile && <SwipeableBottomSheet overflowHeight={0} marginTop={64} open={isBottomSheetOpen} onChange={setIsBottomSheetOpen} fullScreen={false} topShadow={false} shadowTip={false} bodyStyle={{
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      backgroundColor: '#FFFFFF'
    }}>
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
              <div className="space-y-6">
                {allReviews.map(review => <ReviewItem key={review.id} review={review} />)}
              </div>
            </ScrollArea>
          </div>
        </SwipeableBottomSheet>}
    </div>;
};
export default ArtistReviews;
