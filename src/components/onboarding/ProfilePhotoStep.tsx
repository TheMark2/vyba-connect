
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, ScanSearch } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePhotoStepProps {
  onPhotoChange: (photo: File | null, photoPreview?: string) => void;
  initialPhoto?: string;
  initialPhotoFile?: File;
}

const ProfilePhotoStep: React.FC<ProfilePhotoStepProps> = ({
  onPhotoChange,
  initialPhoto,
  initialPhotoFile
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Asegurar que el bucket de avatares existe
  useEffect(() => {
    const createAvatarsBucketIfNeeded = async () => {
      try {
        // Verificar si el bucket ya existe
        const { data: bucketExists } = await supabase
          .storage
          .getBucket('avatars');
          
        // Si el bucket no existe, crearlo
        if (!bucketExists) {
          await supabase.storage.createBucket('avatars', {
            public: true
          });
          console.log('Bucket "avatars" creado');
        }
      } catch (error) {
        console.error('Error al verificar/crear el bucket de avatares:', error);
      }
    };
    
    createAvatarsBucketIfNeeded();
  }, []);

  // Inicializar con la foto previa si existe
  useEffect(() => {
    if (initialPhoto) {
      setPhotoPreview(initialPhoto);
      if (initialPhotoFile) {
        onPhotoChange(initialPhotoFile, initialPhoto);
      } else {
        // Si no hay archivo pero hay URL (avatar predefinido), también pasar esa info
        onPhotoChange(null, initialPhoto);
      }
    }
  }, [initialPhoto, initialPhotoFile, onPhotoChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setPhotoPreview(preview);
        onPhotoChange(file, preview);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const avatarSize = isMobile ? "w-40 h-40" : "w-48 h-48";

  return (
    <div className="content-container w-full max-w-6xl mx-auto">
      <div className="form-container text-center">
        <div className="flex flex-col items-center justify-center">
          <div 
            className="relative group" 
            onMouseEnter={() => setIsHovering(true)} 
            onMouseLeave={() => setIsHovering(false)}
          >
            <div 
              className={`
                ${avatarSize} rounded-full 
                border-2 ${isHovering ? 'border-black dark:border-white' : 'border-dashed border-gray-300'} 
                flex items-center justify-center
                ${photoPreview ? 'bg-transparent' : 'bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30'}
                overflow-hidden cursor-pointer
                transition-all duration-300
              `} 
              onClick={handleButtonClick}
            >
              {photoPreview ? (
                <Avatar className="w-full h-full">
                  <AvatarImage src={photoPreview} alt="Foto de perfil" className="object-cover" />
                  <AvatarFallback className="text-4xl bg-black text-white">
                    <Plus className="w-10 h-10" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Plus className={`w-10 h-10 transition-all duration-300 ${isHovering ? 'text-black dark:text-white' : 'text-gray-400'}`} />
              )}
              
              {isHovering && photoPreview && (
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Cambiar foto</span>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
              aria-label="Subir foto de perfil"
            />
          </div>
          
          <Button 
            onClick={handleButtonClick} 
            variant="secondary" 
            className="mt-10 flex items-center gap-2"
          >
            <ScanSearch className="w-5 h-5" />
            {photoPreview ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoStep;
