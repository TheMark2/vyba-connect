
import React, { useState } from "react";
import { Heart, Flag, Share2, ArrowLeft, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel 
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import ImageGalleryDialog from "./ImageGalleryDialog";
import ReportDialog from "./ReportDialog";
import { toast } from "sonner";
import LoginDialog from "@/components/auth/LoginDialog";

interface ArtistBannerProps {
  artist: {
    name: string;
    type: string;
    images: string[];
    coverImage: string;
  };
  onFavorite: () => void;
  onReport: () => void;
  onShare: () => void;
}

const ArtistBanner = ({ artist, onFavorite, onReport, onShare }: ArtistBannerProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  // Combinamos la imagen de portada con el resto de las imágenes para el carrusel
  const allImages = [artist.coverImage, ...artist.images];

  const openGallery = (index: number) => {
    setActiveImageIndex(index);
    setGalleryOpen(true);
  };

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReportDialogOpen(true);
  };

  const handleReportSubmit = (reason: string, details: string) => {
    console.log("Denuncia enviada:", { artistName: artist.name, reason, details });
    // Aquí normalmente enviarías los datos a tu backend
    onReport();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLoginDialog(true);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: `${artist.name} - ${artist.type}`,
        text: `Descubre a ${artist.name}, ${artist.type} en Vyba`,
        url: window.location.href
      })
      .then(() => onShare())
      .catch((error) => console.log('Error al compartir:', error));
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => onShare())
        .catch(err => console.error('Error al copiar URL: ', err));
    }
  };

  return (
    <>
      <div 
        className={`relative w-full h-[80vh] overflow-hidden ${isMobile ? '' : 'rounded-[25px] lg:rounded-[35px]'} mb-12 group`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Botón de regreso que siempre permanece visible */}
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-40 w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl dark:bg-black/30 text-white" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>

        {/* Carrusel integrado directamente en el banner */}
        <Carousel 
          className="w-full h-[80vh]"
          opts={{
            loop: true,
            align: "start",
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="h-[80vh] gap-0">
            {allImages.map((image, index) => (
              <CarouselItem key={index} className="h-[80vh] w-full cursor-pointer" onClick={() => openGallery(index)}>
                <div className="relative w-full h-[80vh]">
                  <img 
                    src={image} 
                    alt={`${artist.name} imagen ${index + 1}`}
                    className="w-full h-full object-cover object-center" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Hacemos que los controles siempre estén visibles pero con transparencia y blur */}
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-xl z-30 w-10 h-10" />
          
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-xl z-30 w-10 h-10" />
        </Carousel>
        
        {/* Buttons in top right corner - siempre visibles con fondo semitransparente */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex space-x-2 z-30">
          {isMobile && (
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl hover:bg-white/50" 
              onClick={() => setGalleryOpen(true)}
            >
              <Images className="h-5 w-5 text-white" />
            </Button>
          )}
          <Button 
            variant="secondary" 
            size="icon" 
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl hover:bg-white/50" 
            onClick={handleFavoriteClick}
          >
            <Heart className="h-5 w-5 text-white" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl hover:bg-white/50" 
            onClick={handleReportClick}
          >
            <Flag className="h-5 w-5 text-white" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl hover:bg-white/50" 
            onClick={handleShareClick}
          >
            <Share2 className="h-5 w-5 text-white" />
          </Button>
        </div>
        
        {/* Artist info overlay */}
        {isMobile ? (
          <div className="absolute bottom-12 left-5 right-0 flex flex-col items-start z-30">
            <div className="rounded-full overflow-hidden mb-4 w-24 h-24">
              <img src={artist.images[0]} alt={artist.name} className="w-full h-full object-cover rounded-full" />
            </div>
            
            <div className="text-white space-y-2 max-w-[85%]">
              <h1 className="text-2xl font-bold truncate">{artist.name}</h1>
              <p className="text-lg opacity-90 line-clamp-2">{artist.type}</p>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-12 left-5 md:left-10 lg:left-14 flex items-center z-30">
            <div className="rounded-full overflow-hidden mr-4 md:mr-6 w-24 h-24 md:w-32 md:h-32">
              <img src={artist.images[0]} alt={artist.name} className="w-full h-full object-cover rounded-full" />
            </div>
            
            <div className="text-white space-y-4 max-w-[80%]">
              <h1 className="text-3xl md:text-5xl font-bold truncate">{artist.name}</h1>
              <p className="text-xl md:text-2xl opacity-90 line-clamp-2">{artist.type}</p>
            </div>
          </div>
        )}
      </div>

      {/* Imagen con diálogo a pantalla completa o drawer en móvil */}
      <ImageGalleryDialog 
        images={allImages}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        activeImageIndex={activeImageIndex}
        artistName={artist.name}
      />

      {/* Diálogo de denuncia */}
      <ReportDialog 
        artistName={artist.name}
        isOpen={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onSubmit={handleReportSubmit}
      />

      {/* Diálogo de login */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </>
  );
};

export default ArtistBanner;
