import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Ejemplo de uso del componente ResponsiveDialog
 * Este componente muestra cómo implementar ResponsiveDialog en tu aplicación
 */
export function ResponsiveDialogExample() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Ejemplo de ResponsiveDialog</h2>
      <p className="text-gray-500">
        Este diálogo se mostrará como un modal en escritorio y como un drawer en dispositivos móviles.
        Estás actualmente en {isMobile ? 'un dispositivo móvil' : 'un escritorio'}.
      </p>

      <Button onClick={() => setOpen(true)}>
        Abrir {isMobile ? 'Drawer' : 'Dialog'}
      </Button>

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
            Toda la lógica de gestión del estado y la interfaz responsiva está encapsulada
            en el componente ResponsiveDialog, lo que facilita la implementación
            de interfaces adaptativas.
          </p>

          <div className="pt-4 flex justify-end">
            <Button onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </div>
  );
} 