
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
  // Función para manejar el efecto de onda desde el punto de clic
  const handleRippleEffect = (event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    element.appendChild(ripple);
    
    // Eliminar el elemento después de la animación
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] rounded-[40px] p-0 border-none bg-white overflow-hidden">
        <div className="text-center p-12 pt-16 pb-20 flex flex-col items-center">
          {/* Botón de cerrar personalizado */}
          <button
            className="absolute right-6 top-6 p-1.5 rounded-full hover:bg-black/5 transition-colors relative overflow-hidden"
            onClick={(e) => {
              handleRippleEffect(e);
              onOpenChange(false);
            }}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Cerrar</span>
          </button>
          
          {/* Avatar del artista con efecto de sombra desenfocada */}
          <div className="relative mb-8">
            {/* Imagen de fondo con desenfoque */}
            <div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[90px] h-[90px] rounded-2xl bg-contain bg-center"
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
                className="w-[120px] h-[120px] rounded-2xl bg-cover bg-center shadow-lg"
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
            <h3 className="text-xl text-gray-600">Has contactado con</h3>
            <h2 className="text-4xl font-black mb-8">{artistName}</h2>
            
            <p className="text-lg text-gray-600 max-w-sm mx-auto">
              {artistName} te contactará en breves, para seguir la conversación entra en <span className="font-bold">Mensajes</span>
            </p>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-8"
            >
              <Button 
                onClick={(e) => {
                  handleRippleEffect(e);
                  onOpenChange(false);
                }}
                className="bg-blue-100 hover:bg-blue-200 text-black font-medium rounded-full px-8 py-6 text-lg relative overflow-hidden"
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
