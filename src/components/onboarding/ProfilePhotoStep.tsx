import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, ScanSearch, Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Asegurar que el bucket de useravatar existe
  useEffect(() => {
    const createUserAvatarBucketIfNeeded = async () => {
      try {
        // Verificar si el bucket ya existe
        const { data: bucketExists } = await supabase
          .storage
          .getBucket('useravatar');
          
        // Si el bucket no existe, crearlo
        if (!bucketExists) {
          await supabase.storage.createBucket('useravatar', {
            public: true
          });
          console.log('Bucket "useravatar" creado');
        }
      } catch (error) {
        console.error('Error al verificar/crear el bucket de avatares:', error);
      }
    };
    
    createUserAvatarBucketIfNeeded();
  }, []);

  // Inicializar con la foto previa si existe
  useEffect(() => {
    if (initialPhoto) {
      setPhotoPreview(initialPhoto);
      if (initialPhotoFile) {
        onPhotoChange(initialPhotoFile, initialPhoto);
      } else {
        // Si no hay archivo pero hay URL, también pasar esa info
        onPhotoChange(null, initialPhoto);
      }
    }
  }, [initialPhoto, initialPhotoFile, onPhotoChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      console.log("ProfilePhotoStep: No se seleccionó ningún archivo");
      return;
    }
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de archivo no válido", {
        description: "Por favor, selecciona una imagen (JPG, PNG, GIF o WEBP)"
      });
      return;
    }
    
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Archivo demasiado grande", {
        description: "La imagen no debe exceder los 5MB"
      });
      return;
    }
    
    setIsLoading(true);
    console.log("ProfilePhotoStep: Procesando archivo de imagen:", file.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      console.log("ProfilePhotoStep: Imagen convertida a base64 para previsualización");
      setPhotoPreview(preview);
      onPhotoChange(file, preview);
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      toast.error("Error al leer el archivo", {
        description: "No se pudo procesar la imagen seleccionada"
      });
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
    
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de archivo no válido", {
        description: "Por favor, selecciona una imagen (JPG, PNG, GIF o WEBP)"
      });
      return;
    }
    
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Archivo demasiado grande", {
        description: "La imagen no debe exceder los 5MB"
      });
      return;
    }
    
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setPhotoPreview(preview);
      onPhotoChange(file, preview);
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      toast.error("Error al leer el archivo", {
        description: "No se pudo procesar la imagen seleccionada"
      });
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const avatarSize = isMobile ? "w-40 h-40" : "w-48 h-48";

  return (
    <div className="content-container w-full max-w-6xl mx-auto">
      <div className="form-container text-center">
        <div className="flex flex-col items-center justify-center">
          <div 
            className="relative group" 
            onMouseEnter={() => !isLoading && setIsHovering(true)} 
            onMouseLeave={() => setIsHovering(false)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
              onClick={!isLoading ? handleButtonClick : undefined}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  <span className="text-sm mt-2">Procesando...</span>
                </div>
              ) : photoPreview ? (
                <Avatar className="w-full h-full">
                  <AvatarImage 
                    src={photoPreview} 
                    alt="Foto de perfil" 
                    className="object-cover"
                    onError={(e) => {
                      console.error('Error al cargar la imagen previa:', photoPreview);
                      // Cambiar el fallback a visible
                      const fallback = e.currentTarget.parentElement?.querySelector('[data-radix-avatar-fallback]');
                      if (fallback) {
                        (fallback as HTMLElement).style.display = 'flex';
                      }
                    }} 
                  />
                  <AvatarFallback className="text-4xl bg-black text-white">
                    <Plus className="w-10 h-10" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload className={`w-10 h-10 transition-all duration-300 ${isHovering ? 'text-black dark:text-white' : 'text-gray-400'}`} />
                  <p className="text-xs mt-2 text-gray-500">Arrastra o haz clic</p>
                </div>
              )}
              
              {isHovering && photoPreview && !isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Cambiar foto</span>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg,image/png,image/gif,image/webp,image/jpg" 
              className="hidden" 
              aria-label="Subir foto de perfil"
            />
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            Formatos aceptados: JPG, PNG, GIF, WEBP (máx. 5MB)
          </div>
          
          <Button 
            onClick={handleButtonClick} 
            variant="secondary" 
            className="mt-8 flex items-center gap-2"
            disabled={isLoading}
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
