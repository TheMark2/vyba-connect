
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle } from 'lucide-react';
import Image from "@/components/ui/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface OnboardingData {
  artistType?: string;
  artistName?: string;
  artistDescription?: string;
  musicGenres?: string[];
  profilePhoto?: File | null;
  profilePhotoUrl?: string;
  galleryImages?: File[];
  galleryImageUrls?: string[];
  phone?: string;
  price?: string;
}

interface ConfirmationScreenProps {
  onboardingData: OnboardingData;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ onboardingData }) => {
  const navigate = useNavigate();
  
  console.log("Onboarding data in confirmation:", onboardingData);

  // Comprueba si hay imágenes de galería
  const hasGalleryImages = onboardingData.galleryImageUrls && onboardingData.galleryImageUrls.length > 0;
  console.log("Has gallery images:", hasGalleryImages, onboardingData.galleryImageUrls?.length);

  return (
    <div className="flex items-center justify-center bg-[#C3DFF4] h-screen">
      <div className="max-w-7xl w-full mx-auto px-6">
        <div className="grid grid-cols-2 gap-32 items-center">
          {/* Preview de la tarjeta */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.11)]">
            {/* Carrusel de imágenes o foto de perfil si no hay imágenes */}
            <div className="aspect-[5/4] relative rounded-3xl overflow-hidden mb-6">
              {hasGalleryImages ? (
                <Carousel className="w-full h-full">
                  <CarouselContent className="h-full">
                    {onboardingData.galleryImageUrls!.map((url, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div className="h-full w-full flex items-center justify-center">
                          <Image 
                            src={url} 
                            alt={`Galería ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              ) : onboardingData.profilePhotoUrl ? (
                <Image 
                  src={onboardingData.profilePhotoUrl}
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-vyba-gray flex items-center justify-center">
                  <Camera className="w-12 h-12 text-vyba-tertiary" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col justify-between mt-8">
              <div>
                <h2 className="text-3xl font-medium mb-2">{onboardingData.artistName || 'Artista'}</h2>
                <p className="text-vyba-tertiary text-xl">{onboardingData.artistDescription || 'Sin descripción'}</p>
              </div>
              
              <div className="mt-8">
                <h2 className="text-3xl font-medium">desde {onboardingData.price || '0'}€</h2>
              </div>
            </div>
          </div>

          {/* Mensaje de agradecimiento */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-7xl font-semibold">¡Felicidades!</h1>
              <p className="text-xl text-vyba-navy">
                Lo básico ya lo tienes hecho. Ahora debes rellenar la informacion de tu perfil para poder publicarlo.
              </p>
            </div>

            <Button 
              variant="terciary" 
              className="w-full mt-8"
              onClick={() => navigate('/dashboard')}
            >
              Ir al dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
