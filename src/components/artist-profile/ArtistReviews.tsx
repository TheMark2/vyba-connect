import React, { useState, useEffect } from "react";
import { Star, ClockAlert, CornerDownRight, Plus, MessagesSquare, ChevronLeft, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";
import { BottomDrawer } from "@/components/ui/bottom-drawer";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import WriteReviewDialog, { ReviewData } from "./WriteReviewDialog";

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
  isMobileCarousel = false,
  isMobileBottomSheet = false,
  isDesktopCarousel = false
}: {
  review: Review;
  isMobileCarousel?: boolean;
  isMobileBottomSheet?: boolean;
  isDesktopCarousel?: boolean;
}) => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  
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
  const wordLimit = 20;
  const words = review.comment.split(' ');
  const isTextLong = words.length > wordLimit;
  const displayText = isTextLong && !expanded ? words.slice(0, wordLimit).join(' ') + '...' : review.comment;
  
  if (isDesktopCarousel) {
    return (
      <div className="bg-[#F7F7F7] rounded-3xl p-6 h-full flex flex-col justify-between relative">
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white" onClick={handleReminderClick}>
            <ClockAlert className="h-4 w-4 stroke-[2.5px]" />
          </Button>
          <Button variant="default" size="icon" className="h-8 w-8" onClick={handleReportClick}>
            <CornerDownRight className="h-4 w-4 stroke-[2.5px]" />
          </Button>
        </div>
        
        <div className="flex-grow flex flex-col">
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => <Star key={index} className={`h-3 w-3 ${index < review.rating ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 dark:text-gray-600"}`} />)}
          </div>
          
          <h3 className="text-lg font-semibold mb-3 pr-20">{review.title || "Muy buen servicio"}</h3>
          
          <p className="text-base font-light mb-2 transition-all duration-300">{displayText}</p>
          
          {isTextLong && <Button variant="ghost" size="sm" className="self-start p-0 h-8 mb-4 hover:bg-transparent font-medium" onClick={() => setExpanded(!expanded)}>
              {expanded ? <Minus className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              {expanded ? "Ver menos" : "Ver más"}
            </Button>}
        </div>
        
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
  
  if (isMobileBottomSheet) {
    return <div className="mb-6">
        <div className="bg-[#F8F8F8] rounded-3xl p-6 relative">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white rounded-full border-none shadow-none" onClick={handleReminderClick}>
              <ClockAlert className="h-4 w-4 stroke-[2.5px]" />
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8 rounded-full" onClick={handleReportClick}>
              <CornerDownRight className="h-4 w-4 stroke-[2.5px]" />
            </Button>
          </div>
          
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 dark:text-gray-600"}`} />)}
          </div>
          
          <h3 className="text-lg font-bold mb-3 pr-20">{review.title || "Muy buen servicio"}</h3>
          
          <p className="text-base font-light mb-4 transition-all duration-300">{displayText}</p>
          
          {isTextLong && <Button variant="ghost" size="sm" className="self-start p-0 h-8 mb-4 hover:bg-transparent font-medium" onClick={() => setExpanded(!expanded)}>
              {expanded ? <Minus className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              {expanded ? "Ver menos" : "Ver más"}
            </Button>}
          
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
        
        {review.reply && <div className="bg-[#E6E6E6] rounded-3xl p-6 ml-8 mt-3">
            <div className="flex flex-col">
              <p className="text-base font-light mb-4">{review.reply.comment}</p>
              
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
  }
  if (isMobileCarousel) {
    return <div className="bg-white rounded-3xl p-6 h-full flex flex-col justify-between">
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white border-none" onClick={handleReminderClick}>
            <ClockAlert className="h-4 w-4 stroke-[2.5px]" />
          </Button>
          <Button variant="default" size="icon" className="h-8 w-8" onClick={handleReportClick}>
            <CornerDownRight className="h-4 w-4 stroke-[2.5px]" />
          </Button>
        </div>
        
        <div className="flex-grow flex flex-col">
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => <Star key={index} className={`h-3 w-3 ${index < review.rating ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 dark:text-gray-600"}`} />)}
          </div>
          
          <h3 className="text-lg font-bold mb-3 pr-20">{review.title || "Muy buen servicio"}</h3>
          
          <p className="text-base font-light mb-2 transition-all duration-300">{displayText}</p>
          
          {isTextLong && <Button variant="ghost" size="sm" className="self-start p-0 h-8 mb-4 hover:bg-transparent font-medium" onClick={() => setExpanded(!expanded)}>
              {expanded ? <Minus className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              {expanded ? "Ver menos" : "Ver más"}
            </Button>}
        </div>
        
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
      </div>;
  }
  return <div className="mb-6">
      <div className="bg-[#F7F7F7] rounded-3xl p-6 relative">
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white" onClick={handleReminderClick}>
            <ClockAlert className="h-4 w-4 stroke-[2.5px]" />
          </Button>
          <Button variant="default" size="icon" className="h-8 w-8" onClick={handleReportClick}>
            <CornerDownRight className="h-4 w-4 stroke-[2.5px]" />
          </Button>
        </div>
        
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => <Star key={index} className={`h-3 w-3 ${index < review.rating ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 dark:text-gray-600"}`} />)}
          </div>
          
          <h3 className="text-lg font-semibold mb-3 pr-20">{review.title || "Muy buen servicio"}</h3>
          
          <p className="text-base font-light mb-2 transition-all duration-300">{displayText}</p>
          
          {isTextLong && <Button variant="ghost" size="sm" className="self-start p-0 h-8 mb-4 hover:bg-transparent font-medium" onClick={() => setExpanded(!expanded)}>
              {expanded ? <Minus className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              {expanded ? "Ver menos" : "Ver más"}
            </Button>}
          
          <div className="flex items-center mt-4">
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
            <p className="text-base font-light mb-4">{review.reply.comment}</p>
            
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

const moreReviewsData = [
  {
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
      comment: "Muchas gracias por informarnos, Miguel. Fue un placer amenizar tu evento. ¡Espero volver a trabajar contigo pronto!"
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
  }
];

const ArtistReviews = ({
  rating,
  reviews,
  genres,
  reviewsData,
  onBottomSheetChange
}: ArtistReviewsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const isMobile = useIsMobile();
  const isLoggedIn = true;
  
  useEffect(() => {
    if (onBottomSheetChange) {
      onBottomSheetChange(isBottomSheetOpen);
    }
  }, [isBottomSheetOpen, onBottomSheetChange]);
  
  const handleVerTodas = () => {
    if (isMobile) {
      setIsBottomSheetOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };
  
  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };
  
  useEffect(() => {
    return () => {
      if (onBottomSheetChange) {
        onBottomSheetChange(false);
      }
    };
  }, [onBottomSheetChange]);
  
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
    setIsWriteReviewOpen(true);
  };
  
  const handleSubmitReview = (reviewData: ReviewData) => {
    toast.success("Reseña enviada con éxito", {
      description: "Gracias por compartir tu experiencia",
      position: "bottom-center"
    });
  };
  
  return <div className="mt-8 mb-16">
      <div className={`${isMobile ? 'bg-[#F7F7F7] py-8 -mx-6' : ''}`}>
        <div className="flex items-center justify-between mb-6 px-6 sm:px-0">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-semibold font-figtree">
              Reseñas
            </h2>
            <span className="text-3xl font-semibold">•</span>
            <span className="text-3xl font-semibold">{rating}</span>
            <span className="text-3xl font-semibold">({reviews})</span>
          </div>

          {!isMobile && (
            <div className="flex items-center gap-2">
              <Carousel className="w-auto">
                <CarouselContent className="hidden">
                  <CarouselItem>
                    <div></div>
                  </CarouselItem>
                </CarouselContent>
                <div className="flex items-center gap-2">
                  <CarouselPrevious className="relative static translate-y-0 mr-2" />
                  <CarouselNext className="relative static translate-y-0" />
                </div>
              </Carousel>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-6 mb-8 justify-between px-6 sm:px-0">
            {isMobile ? (
              <Button variant="default" size="icon" className="bg-gradient-to-br from-[#D4DDFF] to-[#F0F3FF] border-none" onClick={handleWriteReview}>
                <MessagesSquare className="h-5 w-5 stroke-[2.5px]" />
              </Button>
            ) : null}
          </div>
          
          {isMobile && <div className="mb-10">
              <Carousel opts={{
                align: "center",
                loop: false
              }} className="w-full">
                <CarouselContent className="-ml-2 pl-6 pr-4">
                  {allReviews.slice(0, 5).map((review, index) => <CarouselItem key={review.id} className={`pl-2 w-[85%] max-w-[85%] ${index === allReviews.slice(0, 5).length - 1 ? 'mr-6' : ''}`}>
                      <div className="h-full">
                        <ReviewItem review={review} isMobileCarousel={true} />
                      </div>
                    </CarouselItem>)}
                </CarouselContent>
              </Carousel>
            </div>}
          
          {!isMobile && (
            <div className="mb-10">
              <Carousel opts={{
                align: "start",
                loop: false,
              }} className="w-full">
                <CarouselContent className="-ml-2">
                  {allReviews.slice(0, 4).map((review) => (
                    <CarouselItem key={review.id} className="pl-2 basis-1/2 lg:basis-1/2">
                      <div className="h-full">
                        <ReviewItem review={review} isDesktopCarousel={true} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
          
          <div className="flex justify-center mt-8 gap-4">
            <Button variant={isMobile ? "ghost" : "secondary"} className={isMobile ? "px-12 bg-white border-none font-medium" : "px-12 font-medium"} onClick={handleVerTodas}>
              Ver todas
            </Button>
            
            {!isMobile && (
              <Button 
                variant="secondary" 
                className="flex items-center gap-2 font-medium group" 
                onClick={handleWriteReview}
              >
                <MessagesSquare 
                  className="h-4 w-4 stroke-[2.5px] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:text-[#7E69AB]" 
                />
                Escribir una reseña
              </Button>
            )}
          </div>
        </div>
      </div>

      {!isMobile && <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] border-none bg-white dark:bg-vyba-dark-bg rounded-[40px] pb-0">
            <DialogHeader className="text-left mb-2">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-3xl font-semibold">Reseñas</DialogTitle>
                <span className="text-3xl font-semibold">•</span>
                <span className="text-3xl font-medium ml-2">{rating}</span>
              </div>
            </DialogHeader>

            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6 pb-6">
                {allReviews.map(review => <ReviewItem key={review.id} review={review} />)}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>}

      {isMobile && <BottomDrawer open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen} className="p-0" showCloseButton={false}>
          <div className="px-6 pt-8">
            <div className="mb-6">
              <Button variant="ghost" size="icon" className="p-2 -ml-2 h-10 w-10 mb-4" onClick={handleCloseBottomSheet}>
                <ChevronLeft size={24} />
                <span className="sr-only">Cerrar</span>
              </Button>
              
              <div className="text-3xl font-black">Todas las reseñas</div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg text-gray-600">{allReviews.length} reseñas</div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-medium ml-2">{rating}</span>
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-6 pb-10">
                {allReviews.map(review => <ReviewItem key={review.id} review={review} isMobileBottomSheet={true} />)}
              </div>
            </ScrollArea>
          </div>
        </BottomDrawer>}

      <WriteReviewDialog isOpen={isWriteReviewOpen} onOpenChange={setIsWriteReviewOpen} onSubmit={handleSubmitReview} isLoggedIn={isLoggedIn} />
    </div>;
};

export default ArtistReviews;
