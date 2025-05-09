import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BottomDrawer } from "@/components/ui/bottom-drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  showCloseButton?: boolean;
  centerTitle?: boolean;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
}

/**
 * ResponsiveDialog - Muestra un Dialog en desktop o un BottomDrawer en móvil
 * 
 * Este componente decide automáticamente qué tipo de diálogo mostrar basado
 * en si el dispositivo es móvil o no. En móvil muestra un drawer desde abajo,
 * y en desktop muestra un dialog modal tradicional.
 */
export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = "",
  mobileClassName = "",
  desktopClassName = "",
  showCloseButton = false,
  centerTitle = true,
  showBackButton = true,
  onBackButtonClick,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  // Función para manejar cambio de estado con limpieza común
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };
  
  // Función para manejar el clic en el botón de retroceso
  const handleBackClick = () => {
    if (onBackButtonClick) {
      onBackButtonClick();
    } else {
      // Si no hay handler específico, simplemente cerrar el diálogo
      onOpenChange(false);
    }
  };

  if (isMobile) {
    return (
      <BottomDrawer
        open={open}
        onOpenChange={handleOpenChange}
        className={`px-0 pt-0 rounded-t-[32px] ${className} ${mobileClassName}`}
        showOverlay={true}
        showCloseButton={showCloseButton}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col px-5 pt-4 pb-2">
            {showBackButton && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full p-0 mb-2" 
                onClick={handleBackClick}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Volver</span>
              </Button>
            )}
            {title && (
              <div className="flex items-center justify-center">
                <h2 className="text-2xl font-semibold">{title}</h2>
              </div>
            )}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
          <div className="px-6 py-4 flex-1">
            {children}
          </div>
        </div>
      </BottomDrawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`sm:max-w-lg ${className} ${desktopClassName}`} showCloseButton={showBackButton}>
        <div className="flex items-center mb-2">
          {title && (
            <DialogHeader className="w-full">
              <DialogTitle className={centerTitle ? "text-center" : ""}>{title}</DialogTitle>
            </DialogHeader>
          )}
        </div>
        <div className="py-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
} 