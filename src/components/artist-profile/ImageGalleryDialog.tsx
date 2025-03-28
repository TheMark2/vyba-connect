
import React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageGalleryDialogProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  activeImageIndex?: number;
}

const ImageGalleryDialog = ({ 
  images, 
  isOpen, 
  onClose,
  activeImageIndex = 0 
}: ImageGalleryDialogProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "p-0 w-full h-full max-w-none max-h-screen bg-vyba-cream dark:bg-black text-black dark:text-white",
        isMobile ? "" : "rounded-none"
      )}>
        <div className="fixed top-4 right-4 z-50">
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
          </DialogClose>
        </div>
        
        <div className="h-full w-full overflow-y-auto p-8 pt-16">
          <div className="flex flex-wrap gap-6 justify-center">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="w-[350px] flex-grow-0 flex-shrink-0 mb-6"
                id={index === activeImageIndex ? "active-image" : undefined}
                ref={el => {
                  if (el && index === activeImageIndex) {
                    setTimeout(() => {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }
                }}
              >
                <div className="rounded-2xl overflow-hidden shadow-sm">
                  <AspectRatio ratio={16/9} className="bg-black/10">
                    <img 
                      src={image} 
                      alt={`Imagen ${index + 1}`} 
                      className="object-contain h-full w-full"
                    />
                  </AspectRatio>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <Button 
            variant="secondary" 
            className="rounded-full px-8 py-2 bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryDialog;
