import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera } from 'lucide-react';
import Image from "@/components/ui/image";

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

const backgroundColors = ['#FCDCA9', '#BBA9D2', '#A5E0D9', '#C3DFF4'];

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ onboardingData }) => {
  const navigate = useNavigate();
  const [backgroundColor, setBackgroundColor] = useState('#C3DFF4');
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    setBackgroundColor(backgroundColors[randomIndex]);
  }, []);
  
  // Comprueba si hay imágenes de galería
  const hasGalleryImages = onboardingData.galleryImageUrls && onboardingData.galleryImageUrls.length > 0;
  const mainImage = hasGalleryImages ? onboardingData.galleryImageUrls![0] : onboardingData.profilePhotoUrl;

  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor }}>
      <div className="max-w-7xl w-full mx-auto px-6">
        <div className="grid grid-cols-2 gap-32 items-center">
          {/* Preview de la tarjeta */}
          <div className="bg-white rounded-[40px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.11)]">
            {/* Imagen principal */}
            <div className="aspect-[5/4] relative rounded-3xl overflow-hidden mb-6">
              {mainImage ? (
                <>
                  <Image 
                    src={mainImage}
                    alt="Imagen principal" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/20 backdrop-blur-lg text-vyba-navy px-4 py-2 text-sm font-medium">
                      {onboardingData.artistType || 'Artista'}
                    </Badge>
                  </div>
                </>
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
              
              <div className="mt-4">
                <p className="text-vyba-tertiary text-xl mb-2">{onboardingData.musicGenres?.join(', ') || 'Sin géneros'}</p>
                <p className="text-vyba-tertiary text-xl">Desde {onboardingData.price || '0'}€</p>
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
