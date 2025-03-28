
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  artistImage = "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png"
}: SuccessDialogProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-[500px] p-0 border-none bg-white overflow-hidden",
        isMobile ? 
          "max-h-[85vh] bottom-0 top-auto rounded-t-[32px] pb-24 pt-10" : 
          "rounded-[40px] pt-16 pb-20"
      )}>
        <div className="text-center px-12 flex flex-col items-center">
          
          {/* Avatar del artista con efecto de sombra desenfocada */}
          <div className="relative mb-10">
            {/* Imagen de fondo con desenfoque */}
            <div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[100px] h-[100px] rounded-2xl bg-contain bg-center"
              style={{
                backgroundImage: `url(${artistImage})`,
                filter: "blur(16px)",
                opacity: 0.6,
                zIndex: 0
              }}
            />
            
            {/* Imagen principal */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10"
            >
              <div 
                className="w-[140px] h-[140px] rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${artistImage})` }}
              />
            </motion.div>
          </div>
          
          {/* Texto de confirmación */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="space-y-2 mb-12">
              <h3 className="text-xl">Has contactado con</h3>
              <h2 className="text-4xl font-black">{artistName}</h2>
            </div> 

            <p className="text-base max-w-sm mx-auto mb-8">
              {artistName} te contactará en breves, para seguir la conversación entra en <span className="font-black">Mensajes</span>
            </p>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className={cn(
                "mt-10",
                isMobile ? "sticky bottom-12 pb-6 w-full" : ""
              )}
            >
              <Button 
                onClick={() => onOpenChange(false)}
                className={isMobile ? "w-full" : ""}
              >
                Ver conversación
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;

// Importación necesaria para la función cn
import { cn } from "@/lib/utils";
