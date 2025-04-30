import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Images, ImagePlus, X, Trash2, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
interface GalleryImage {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
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
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [dragOverImage, setDragOverImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

    // Convert FileList to array and create new image objects with loading state
    const newImageFiles = Array.from(selectedFiles).map((file, index) => {
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file),
        // Solo la primera imagen del lote es main si no hay imágenes previas
        isMain: images.length === 0 && index === 0,
        isLoading: true
      };
    });

    // Update state with new images (in loading state)
    const updatedImages = [...images, ...newImageFiles];

    // Si no hay ninguna imagen principal, marcar la primera como principal
    if (!updatedImages.some(img => img.isMain) && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }
    setImages(updatedImages);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Simulate image processing delay (you can remove this in production if not needed)
    // Process each image individually with different timing to make it more realistic
    newImageFiles.forEach((img, index) => {
      setTimeout(() => {
        setImages(prevImages => {
          const newImages = [...prevImages];
          const imgIndex = newImages.findIndex(i => i.id === img.id);
          if (imgIndex !== -1) {
            newImages[imgIndex] = {
              ...newImages[imgIndex],
              isLoading: false
            };
          }
          return newImages;
        });

        // Only update onImagesChange after all images are loaded
        if (index === newImageFiles.length - 1) {
          setTimeout(() => {
            // Call the onImagesChange prop with all files
            onImagesChange(updatedImages.map(img => img.file));
          }, 100);
        }
      }, 1000 + index * 500); // Stagger the loading times a bit
    });
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
    const isRemovingMainImage = selectedImages.some(id => images.find(img => img.id === id)?.isMain);

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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedImage(id);
    // Add drag styling
    e.currentTarget.classList.add('opacity-50', 'scale-95');
    // Set data transfer for Firefox compatibility
    e.dataTransfer.setData('text/plain', id);
    // Set the drag image (optional, improves UX)
    const img = new Image();
    img.src = images.find(img => img.id === id)?.preview || '';
    e.dataTransfer.setDragImage(img, 50, 50);
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedImage(null);
    setDragOverImage(null);
    // Remove drag styling
    e.currentTarget.classList.remove('opacity-50', 'scale-95');
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    if (draggedImage === id) return; // Don't highlight if dragging over self
    setDragOverImage(id);
  };
  const handleDragLeave = () => {
    setDragOverImage(null);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!draggedImage || draggedImage === targetId) {
      setDraggedImage(null);
      setDragOverImage(null);
      return;
    }

    // Reorder images
    const draggedIndex = images.findIndex(img => img.id === draggedImage);
    const targetIndex = images.findIndex(img => img.id === targetId);
    if (draggedIndex < 0 || targetIndex < 0) return;
    const newImages = [...images];
    const [movedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, movedImage);

    // Update the main image if it was moved and it was the first item
    if (movedImage.isMain && targetIndex !== 0) {
      // If we moved the main image from position 0, make the new first image main
      movedImage.isMain = false;
      newImages[0].isMain = true;
    } else if (!movedImage.isMain && targetIndex === 0 && draggedIndex !== 0) {
      // If we moved a non-main image to position 0, make it main
      movedImage.isMain = true;
      const previousMainImage = newImages.find((img, idx) => idx !== 0 && img.isMain);
      if (previousMainImage) {
        previousMainImage.isMain = false;
      }
    }
    setImages(newImages);
    onImagesChange(newImages.map(img => img.file));
    setDraggedImage(null);
    setDragOverImage(null);

    // Create drop animation effect
    const targetElem = e.currentTarget;
    targetElem.classList.add('scale-105');
    setTimeout(() => {
      targetElem.classList.remove('scale-105');
    }, 300);
  };
  return <div className="flex flex-col items-center justify-center w-full pt-8">
      <div className="w-full text-center">
        
        {/* Upload area */}
        <div className="mb-8 relative">
          {images.length === 0 && <div className="border-2 border-dashed border-gray-300 bg-vyba-gray dark:border-gray-600 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:border-solid dark:hover:bg-vyba-dark-secondary/10 transition-all duration-300" onClick={handleAddImages}>
              <Images className="w-10 h-10 text-vyba-tertiary mb-4 stroke-[1.5px]" />
              <p className="text-vyba-tertiary mb-2">Arrastra tus imágenes aquí o haz clic para explorar</p>
              <p className="text-vyba-tertiary font-medium text-xs">JPG, PNG o GIF (max. 5MB)</p>
            </div>}
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
          
          {images.length > 0 && images.length < 5 && <Button onClick={handleAddImages} variant="secondary" className="mb-8" disabled={isLoading}>
              <ImagePlus className="w-4 h-4 mr-2" />
              Añadir imágenes
            </Button>}
        </div>
        
        {/* Image grid */}
        <div className="relative">
          {images.length > 0 && <>
              <p className="text-gray-500 text-sm mb-6">Arrastra y suelta para reordenar las imágenes. La primera imagen será la principal.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Main image (double width) */}
                {images.filter(img => img.isMain).map(image => <Card key={image.id} className={`col-span-2 row-span-2 relative rounded-lg overflow-hidden shadow-none cursor-pointer transition-all duration-500 ease-in-out ${selectedImages.includes(image.id) ? 'ring-4 ring-primary' : ''} ${dragOverImage === image.id ? 'scale-105 ring-2 ring-primary/50' : ''}`} onClick={e => toggleImageSelection(image.id, e as React.MouseEvent<HTMLDivElement>)} draggable onDragStart={e => handleDragStart(e, image.id)} onDragEnd={handleDragEnd} onDragOver={e => handleDragOver(e, image.id)} onDragLeave={handleDragLeave} onDrop={e => handleDrop(e, image.id)}>
                    <div className="relative w-full h-full">
                      <img src={image.preview} alt="Preview" className="w-full h-full object-cover aspect-[1.5/1]" />
                      
                      {/* Per-image loading spinner */}
                      {image.isLoading && <div className="absolute inset-0 bg-gray-200/70 dark:bg-gray-800/70 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>}
                    
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-white text-black font-medium">Imagen principal</Badge>
                      </div>
                      
                      {/* Selection overlay with transition */}
                      <div className={`absolute inset-0 bg-black transition-all duration-500 ease-in-out ${selectedImages.includes(image.id) ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}>
                        {selectedImages.includes(image.id) && <div className="absolute bottom-2 right-2 bg-white text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ease-in-out animate-scale-in">
                            {getSelectionIndex(image.id)}
                          </div>}
                      </div>
                    </div>
                  </Card>)}
                
                {/* Other images */}
                {images.filter(img => !img.isMain).map(image => <Card key={image.id} className={`relative aspect-square rounded-lg overflow-hidden shadow-none cursor-pointer transition-all duration-500 ease-in-out ${selectedImages.includes(image.id) ? 'ring-4 ring-primary' : ''} ${dragOverImage === image.id ? 'scale-105 ring-2 ring-primary/50' : ''}`} onClick={e => toggleImageSelection(image.id, e as React.MouseEvent<HTMLDivElement>)} draggable onDragStart={e => handleDragStart(e, image.id)} onDragEnd={handleDragEnd} onDragOver={e => handleDragOver(e, image.id)} onDragLeave={handleDragLeave} onDrop={e => handleDrop(e, image.id)}>
                    <div className="relative w-full h-full">
                      <img src={image.preview} alt="Preview" className="w-full h-full object-cover" />
                      
                      {/* Per-image loading spinner */}
                      {image.isLoading && <div className="absolute inset-0 bg-gray-200/70 dark:bg-gray-800/70 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>}
                    
                      {/* Selection overlay with transition */}
                      <div className={`absolute inset-0 bg-black transition-all duration-500 ease-in-out ${selectedImages.includes(image.id) ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}>
                        {selectedImages.includes(image.id) && <div className="absolute bottom-2 right-2 bg-white text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ease-in-out animate-scale-in">
                            {getSelectionIndex(image.id)}
                          </div>}
                      </div>
                    </div>
                  </Card>)}
              </div>
              
              {/* Delete selected button */}
              {selectedImages.length > 0 && <Button variant="secondary" className="mt-6" onClick={handleDeleteSelected}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar {selectedImages.length} {selectedImages.length === 1 ? 'imagen' : 'imágenes'}
                </Button>}
            </>}
          
          {/* Loading overlay */}
          {isLoading && <div className="absolute inset-0 bg-gray-200/70 dark:bg-gray-800/70 rounded-lg flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">Cargando imágenes...</p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default GalleryImagesStep;