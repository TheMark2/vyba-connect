import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
interface ProfilePhotoStepProps {
  onPhotoChange: (photo: File | null) => void;
  initialPhoto?: string;
}
const ProfilePhotoStep: React.FC<ProfilePhotoStepProps> = ({
  onPhotoChange,
  initialPhoto
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhoto || null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        onPhotoChange(file);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  return <div className="flex flex-col items-center justify-center w-full pt-28 px-4 md:px-8">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 dark:text-white">
          Elige tu foto de perfil
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">
          Las imágenes con buena calidad y profesionales aumentan la probabilidad de contratación un 75%
        </p>
        
        <div className="flex flex-col items-center justify-center">
          <div className="relative group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <div className={`
                w-48 h-48 rounded-full 
                border-2 ${isHovering ? 'border-black dark:border-white' : 'border-dashed border-gray-300'} 
                flex items-center justify-center
                ${photoPreview ? 'bg-transparent' : 'bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30'}
                overflow-hidden cursor-pointer
                transition-all duration-300
              `} onClick={handleButtonClick}>
              {photoPreview ? <Avatar className="w-full h-full">
                  <AvatarImage src={photoPreview} alt="Foto de perfil" className="object-cover" />
                  <AvatarFallback className="text-4xl">
                    <Plus className="w-10 h-10" />
                  </AvatarFallback>
                </Avatar> : <Plus className={`w-10 h-10 transition-all duration-300 ${isHovering ? 'text-black dark:text-white' : 'text-gray-400'}`} />}
              
              {isHovering && photoPreview && <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Cambiar foto</span>
                </div>}
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
          
          <Button onClick={handleButtonClick} variant="secondary" className="mt-10">
            Subir foto de perfil
          </Button>
        </div>
      </div>
    </div>;
};
export default ProfilePhotoStep;