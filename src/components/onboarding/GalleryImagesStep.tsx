import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, ImagePlus, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface GalleryImage {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // Convert FileList to array and create new image objects
    const newImageFiles = Array.from(selectedFiles).map(file => {
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file),
        isMain: images.length === 0 // First image is main by default
      };
    });
    
    // Update state with new images
    const updatedImages = [...images, ...newImageFiles];
    setImages(updatedImages);
    
    // Call the onImagesChange prop with all files
    onImagesChange(updatedImages.map(img => img.file));
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    
    // If we're removing the main image, set the first remaining image as main
    if (updatedImages.length > 0 && images.find(img => img.id === id)?.isMain) {
      updatedImages[0].isMain = true;
    }
    
    setImages(updatedImages);
    onImagesChange(updatedImages.map(img => img.file));
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
    fileInputRef.current?.click();
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
          
          {images.length > 0 && (
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Main image (double width) */}
            {images.filter(img => img.isMain).map(image => (
              <Card 
                key={image.id} 
                className="col-span-2 row-span-2 relative rounded-lg overflow-hidden group"
              >
                <img 
                  src={image.preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover aspect-[1.5/1]" 
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-white text-black font-medium">Imagen principal</Badge>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button 
                    variant="destructive" 
                    size="icon"
                    className="rounded-full"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
            
            {/* Other images */}
            {images.filter(img => !img.isMain).map(image => (
              <Card 
                key={image.id} 
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img 
                  src={image.preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleSetMainImage(image.id)}
                  >
                    Principal
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    className="rounded-full"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryImagesStep;
