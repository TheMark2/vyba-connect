import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

/**
 * Ejemplo de uso del componente ResponsiveDialog
 * Este componente muestra cómo implementar ResponsiveDialog en tu aplicación
 */
export function ResponsiveDialogExample() {
  const [open, setOpen] = useState(false);
  const [secondDialogOpen, setSecondDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleBackClick = () => {
    toast.info("Botón de retroceso presionado");
    // Puedes implementar lógica personalizada aquí
    // Por ejemplo, navegación entre pasos de un formulario
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Ejemplo de ResponsiveDialog</h2>
      <p className="text-gray-500">
        Este diálogo se mostrará como un modal en escritorio y como un drawer en dispositivos móviles.
        Estás actualmente en {isMobile ? 'un dispositivo móvil' : 'un escritorio'}.
      </p>

      <div className="flex gap-4">
        <Button onClick={() => setOpen(true)}>
          Diálogo estándar
        </Button>
        
        <Button onClick={() => setSecondDialogOpen(true)} variant="outline">
          Con retroceso personalizado
        </Button>
      </div>

      {/* Diálogo estándar */}
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Título del diálogo"
        centerTitle={true}
      >
        <div className="space-y-4">
          <p>
            Este es un ejemplo de contenido dentro del ResponsiveDialog. Este componente
            detecta automáticamente si el usuario está en un dispositivo móvil y muestra
            un drawer desde la parte inferior en lugar de un diálogo modal tradicional.
          </p>
          
          <p>
            El botón de retroceso (chevron izquierdo) está habilitado por defecto en la
            esquina superior izquierda y cierra el diálogo cuando se presiona.
          </p>

          <div className="pt-4 flex justify-end">
            <Button onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </ResponsiveDialog>

      {/* Diálogo con función personalizada de retroceso */}
      <ResponsiveDialog
        open={secondDialogOpen}
        onOpenChange={setSecondDialogOpen}
        title="Retroceso personalizado"
        onBackButtonClick={handleBackClick}
      >
        <div className="space-y-4">
          <p>
            En este ejemplo, el botón de retroceso tiene una función personalizada
            que muestra una notificación antes de cerrar el diálogo.
          </p>
          
          <p className="font-medium">
            Haz clic en el botón de retroceso (chevron izquierdo) para ver el comportamiento personalizado.
          </p>

          <div className="pt-4 flex justify-end">
            <Button onClick={() => setSecondDialogOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </div>
  );
} 