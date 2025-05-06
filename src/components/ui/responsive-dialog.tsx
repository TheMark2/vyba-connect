import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BottomDrawer } from "@/components/ui/bottom-drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  showCloseButton?: boolean;
  centerTitle?: boolean;
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
  children,
  className = "",
  mobileClassName = "",
  desktopClassName = "",
  showCloseButton = false,
  centerTitle = true,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  // Función para manejar cambio de estado con limpieza común
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
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
          {title && (
            <div className="flex items-center px-5 py-4 w-full">
              <div className={`flex items-center ${centerTitle ? 'justify-center w-full' : ''}`}>
                <h2 className="text-2xl font-semibold">{title}</h2>
              </div>
            </div>
          )}
          <div className="px-6 py-4 flex-1">
            {children}
          </div>
        </div>
      </BottomDrawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`sm:max-w-lg ${className} ${desktopClassName}`}>
        {title && (
          <DialogHeader>
            <DialogTitle className={centerTitle ? "text-center" : ""}>{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="py-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
} 