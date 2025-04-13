
import React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageGalleryDialogProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  activeImageIndex?: number;
  artistName?: string;
}

const ImageGalleryDialog = ({
  images,
  isOpen,
  onClose,
  activeImageIndex = 0,
  artistName = "Artista"
}: ImageGalleryDialogProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className={cn(
        "p-0 w-full h-full max-w-none max-h-screen bg-white dark:bg-black text-black dark:text-white", 
        isMobile ? "rounded-none" : "rounded-none"
      )}>
        <DialogClose className="absolute left-6 top-8 z-50 rounded-full p-2 hover:bg-muted/20">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="h-full w-full overflow-y-auto p-8 pt-16">
          <div className="flex flex-wrap gap-2 justify-center">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="mb-2" 
                id={index === activeImageIndex ? "active-image" : undefined} 
                ref={el => {
                  if (el && index === activeImageIndex) {
                    setTimeout(() => {
                      el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }, 100);
                  }
                }}
              >
                <div className="rounded-3xl overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Imagen ${index + 1}`} 
                    className="object-contain rounded-3xl" 
                    style={{
                      maxWidth: isMobile ? '85vw' : '70vw',
                      maxHeight: isMobile ? '85vh' : '70vh'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryDialog;
