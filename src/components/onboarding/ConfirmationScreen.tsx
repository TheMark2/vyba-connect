
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from "@/components/ui/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface OnboardingData {
  artistType?: string;
  artistName?: string;
  artistDescription?: string;
  musicGenres?: string[];
  profilePhoto?: File | null;
  galleryImages?: File[];
  phone?: string;
  price?: string;
}

interface ConfirmationScreenProps {
  onboardingData: OnboardingData;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ onboardingData }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Crear URL para la foto de perfil
    if (onboardingData?.profilePhoto instanceof File) {
      const profileUrl = URL.createObjectURL(onboardingData.profilePhoto);
      setProfilePhotoUrl(profileUrl);

      // Cleanup
      return () => {
        URL.revokeObjectURL(profileUrl);
      };
    }
  }, [onboardingData?.profilePhoto]);

  useEffect(() => {
    // Crear URLs para las imágenes de la galería
    if (onboardingData?.galleryImages && Array.isArray(onboardingData.galleryImages)) {
      console.log("Gallery images found:", onboardingData.galleryImages.length);
      
      const urls = onboardingData.galleryImages.map(file => {
        if (file instanceof File) {
          console.log("Creating URL for file:", file.name);
          return URL.createObjectURL(file);
        }
        return null;
      }).filter((url): url is string => url !== null);
      
      console.log("Created image URLs:", urls);
      setImageUrls(urls);

      // Cleanup
      return () => {
        urls.forEach(url => {
          URL.revokeObjectURL(url);
        });
      };
    } else {
      console.log("No gallery images found or not in expected format");
    }
  }, [onboardingData?.galleryImages]);

  const handlePrevImage = () => {
    if (imageUrls.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? imageUrls.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (imageUrls.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#C3DFF4] h-screen">
      <div className="max-w-7xl w-full mx-auto px-6">
        <div className="grid grid-cols-2 gap-32 items-center">
          {/* Preview de la tarjeta */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.11)]">
            {/* Carrusel de imágenes o foto de perfil si no hay imágenes */}
            <div className="aspect-[5/4] relative rounded-3xl overflow-hidden mb-6">
              {imageUrls.length > 0 ? (
                <Carousel className="w-full h-full">
                  <CarouselContent className="h-full">
                    {imageUrls.map((url, index) => (
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
              ) : profilePhotoUrl ? (
                <Image 
                  src={profilePhotoUrl}
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
