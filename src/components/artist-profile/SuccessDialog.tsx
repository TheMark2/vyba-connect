
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
  
  // Contenido común para el diálogo/drawer
  const ContentComponent = (
    <div className="text-center px-12 flex flex-col items-center">
      {/* Avatar del artista con efecto de sombra desenfocada */}
      <div className={cn("relative", isMobile ? "mb-14" : "mb-10")}>
        {/* Imagen de fondo con desenfoque */}
        <div style={{
          backgroundImage: `url(${artistImage})`,
          filter: "blur(20px)",
          opacity: 0.6,
          zIndex: 0
        }} className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[150px] h-[150px] rounded-2xl bg-contain bg-center" />
        
        {/* Imagen principal */}
        <motion.div initial={{
          scale: 0.8,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 0.4,
          ease: "easeOut"
        }} className="relative z-10">
          <div className="w-[140px] h-[140px] rounded-2xl bg-cover bg-center" style={{
            backgroundImage: `url(${artistImage})`
          }} />
        </motion.div>
      </div>
      
      {/* Texto de confirmación */}
      <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.4,
        delay: 0.2,
        ease: "easeOut"
      }} className="space-y-4">
        <div className="space-y-2 mb-12">
          <h3 className="text-xl">Has contactado con</h3>
          <h2 className="text-4xl font-black">{artistName}</h2>
        </div> 

        <p className={cn("text-base max-w-sm mx-auto mb-8")}>
          {artistName} te contactará en breves, para seguir la conversación entra en <span className="font-black">Mensajes</span>
        </p>
        
        <motion.div initial={{
          y: 10,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.3,
          delay: 0.4
        }}>
          <Button onClick={() => onOpenChange(false)} className={isMobile ? "w-full" : ""}>
            Ver conversación
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="bg-white dark:bg-vyba-dark-secondary p-0 border-none rounded-t-[32px] pb-12 pt-10 max-h-[85vh]">
            <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>
            {ContentComponent}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className={cn("max-w-[500px] p-0 border-none bg-white dark:bg-vyba-dark-secondary overflow-hidden rounded-[40px] pt-16 pb-20")}>
            {ContentComponent}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SuccessDialog;
