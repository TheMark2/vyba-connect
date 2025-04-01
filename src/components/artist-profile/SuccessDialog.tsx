
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistName: string;
  artistImage?: string;
}

const SuccessDialog = ({
  open,
  onOpenChange,
  artistName,
  artistImage = "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png" // Imagen más viva por defecto
}: SuccessDialogProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-[500px] p-0 border-none bg-white dark:bg-vyba-dark-secondary overflow-hidden", isMobile ? "max-h-[85vh] bottom-0 top-auto rounded-t-[32px] pb-24 pt-10" : "rounded-[40px] pt-16 pb-20")}>
        <div className="text-center px-12 flex flex-col items-center">
          
          {/* Avatar del artista con efecto de sombra desenfocada */}
          <div className={cn("relative", isMobile ? "mb-14" : "mb-10")}>
            {/* Imagen de fondo con desenfoque */}
            <div 
              style={{
                backgroundImage: `url(${artistImage})`,
                filter: "blur(20px)",
                opacity: 0.6,
                zIndex: 0
              }} 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[150px] h-[150px] rounded-2xl bg-contain bg-center" 
            />
            
            {/* Imagen principal */}
            <div className="relative z-10">
              <div 
                className="w-[140px] h-[140px] rounded-2xl bg-cover bg-center" 
                style={{
                  backgroundImage: `url(${artistImage})`
                }} 
              />
            </div>
          </div>
          
          {/* Texto de confirmación */}
          <div className="space-y-4">
            <div className="space-y-2 mb-12">
              <h3 className="text-xl">Has contactado con</h3>
              <h2 className="text-4xl font-black">{artistName}</h2>
            </div> 

            <p className={cn("text-base max-w-sm mx-auto", isMobile ? "mb-16" : "mb-8")}>
              {artistName} te contactará en breves, para seguir la conversación entra en <span className="font-black">Mensajes</span>
            </p>
            
            <div className={cn("mt-10", isMobile ? "" : "")}>
              <Button onClick={() => onOpenChange(false)} className={isMobile ? "w-full" : ""}>
                Ver conversación
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
