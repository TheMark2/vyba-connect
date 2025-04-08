
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, ImagePlus, X, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface GalleryImage {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
  isSelected?: boolean;
}

interface GalleryImagesStepProps {
  onImagesChange: (images: File[]) => void;
  initialImages?: File[];
}

const GalleryImagesStep: React.FC<GalleryImagesStepProps> = ({ 
  onImagesChange,
  initialImages = []
}) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // Check if adding these files would exceed the limit of 5
    if (images.length + selectedFiles.length > 5) {
      toast({
        title: "Límite de imágenes",
        description: "Solo puedes subir un máximo de 5 imágenes.",
        variant: "destructive"
      });
      return;
    }
    
    // Convert FileList to array and create new image objects
    const newImageFiles = Array.from(selectedFiles).map((file, index) => {
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file),
        // Solo la primera imagen del lote es main si no hay imágenes previas
        isMain: images.length === 0 && index === 0
      };
    });
    
    // Update state with new images
    const updatedImages = [...images, ...newImageFiles];
    
    // Si no hay ninguna imagen principal, marcar la primera como principal
    if (!updatedImages.some(img => img.isMain) && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }
    
    setImages(updatedImages);
    
    // Call the onImagesChange prop with all files
    onImagesChange(updatedImages.map(img => img.file));
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveImage = (id: string) => {
    const removedImage = images.find(img => img.id === id);
    const updatedImages = images.filter(img => img.id !== id);
    
    // If we're removing the main image, set the first remaining image as main
    if (updatedImages.length > 0 && removedImage?.isMain) {
      updatedImages[0].isMain = true;
    }
    
    setImages(updatedImages);
    onImagesChange(updatedImages.map(img => img.file));
    
    // Remove from selected images if present
    setSelectedImages(prevSelected => prevSelected.filter(imgId => imgId !== id));
  };
  
  const handleSetMainImage = (id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isMain: img.id === id
    }));
    
    setImages(updatedImages);
    onImagesChange(updatedImages.map(img => img.file));
  };
  
  const handleAddImages = () => {
    if (images.length >= 5) {
      toast({
        title: "Límite de imágenes",
        description: "Ya has alcanzado el límite de 5 imágenes.",
        variant: "destructive"
      });
      return;
    }
    fileInputRef.current?.click();
  };
  
  const toggleImageSelection = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    // Crear el efecto radial como en los botones
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    card.appendChild(ripple);
    
    // Eliminar el elemento después de la animación
    setTimeout(() => {
      ripple.remove();
    }, 800);
    
    // Actualizar la selección
    setSelectedImages(prev => {
      if (prev.includes(id)) {
        return prev.filter(imgId => imgId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleDeleteSelected = () => {
    // First check if we're removing the main image
    const isRemovingMainImage = selectedImages.some(id => 
      images.find(img => img.id === id)?.isMain
    );
    
    // Filter out selected images
    const updatedImages = images.filter(img => !selectedImages.includes(img.id));
    
    // If we're removing the main image and have other images left, set a new main
    if (isRemovingMainImage && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }
    
    setImages(updatedImages);
    onImagesChange(updatedImages.map(img => img.file));
    setSelectedImages([]);
    
    toast({
      title: "Imágenes eliminadas",
      description: `Se ${selectedImages.length === 1 ? 'ha' : 'han'} eliminado ${selectedImages.length} ${selectedImages.length === 1 ? 'imagen' : 'imágenes'} correctamente.`
    });
  };
  
  // Helper to get selection index (for numbering)
  const getSelectionIndex = (id: string) => {
    return selectedImages.indexOf(id) + 1;
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full pt-28 px-4 md:px-8">
      <div className="max-w-3xl w-full text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 dark:text-white">
          Elige 5 fotos
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">
          Las imágenes con buena calidad y profesionales aumentan la probabilidad de contratación un 75%
        </p>
        
        {/* Upload area */}
        <div className="mb-8">
          {images.length === 0 && (
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-vyba-dark-secondary/10 transition-all"
              onClick={handleAddImages}
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">Arrastra tus imágenes aquí o haz clic para explorar</p>
              <p className="text-gray-400 text-sm">JPG, PNG o GIF (max. 5MB)</p>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          {images.length > 0 && images.length < 5 && (
            <Button 
              onClick={handleAddImages}
              variant="secondary"
              className="mb-8"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Añadir imágenes
            </Button>
          )}
        </div>
        
        {/* Image grid */}
        {images.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Main image (double width) */}
              {images.filter(img => img.isMain).map(image => (
                <Card 
                  key={image.id} 
                  className={`col-span-2 row-span-2 relative rounded-lg overflow-hidden shadow-none cursor-pointer transition-all duration-500 ease-in-out ${selectedImages.includes(image.id) ? 'ring-4 ring-primary' : ''}`}
                  onClick={(e) => toggleImageSelection(image.id, e as React.MouseEvent<HTMLDivElement>)}
                >
                  <img 
                    src={image.preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover aspect-[1.5/1]" 
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white text-black font-medium">Imagen principal</Badge>
                  </div>
                  
                  {/* Selection overlay with transition */}
                  <div className={`absolute inset-0 bg-black transition-all duration-500 ease-in-out ${selectedImages.includes(image.id) ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}>
                    {selectedImages.includes(image.id) && (
                      <div className="absolute bottom-2 right-2 bg-white text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ease-in-out animate-scale-in">
                        {getSelectionIndex(image.id)}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              
              {/* Other images */}
              {images.filter(img => !img.isMain).map(image => (
                <Card 
                  key={image.id} 
                  className={`relative aspect-square rounded-lg overflow-hidden shadow-none cursor-pointer transition-all duration-500 ease-in-out ${selectedImages.includes(image.id) ? 'ring-4 ring-primary' : ''}`}
                  onClick={(e) => toggleImageSelection(image.id, e as React.MouseEvent<HTMLDivElement>)}
                >
                  <img 
                    src={image.preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* Selection overlay with transition */}
                  <div className={`absolute inset-0 bg-black transition-all duration-500 ease-in-out ${selectedImages.includes(image.id) ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}>
                    {selectedImages.includes(image.id) && (
                      <div className="absolute bottom-2 right-2 bg-white text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ease-in-out animate-scale-in">
                        {getSelectionIndex(image.id)}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Delete selected button */}
            {selectedImages.length > 0 && (
              <Button 
                variant="secondary" 
                className="mt-6"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar {selectedImages.length} {selectedImages.length === 1 ? 'imagen' : 'imágenes'}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GalleryImagesStep;
