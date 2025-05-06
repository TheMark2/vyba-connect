# Componentes UI

## ResponsiveDialog

El componente `ResponsiveDialog` proporciona una interfaz adaptativa que muestra un diálogo modal en escritorio y un drawer desde la parte inferior en dispositivos móviles.

### Características

- Detecta automáticamente el tamaño de pantalla (móvil/desktop)
- Muestra un Dialog en escritorio y un BottomDrawer en móvil
- Gestión unificada del estado abierto/cerrado
- Soporte para títulos centrados o alineados a la izquierda
- Botón de retroceso (chevron izquierdo) configurable
- Clases CSS personalizables para móvil y escritorio

### Uso básico

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Abrir diálogo
      </Button>

      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Título del diálogo"
      >
        <div className="space-y-4">
          <p>Contenido de mi diálogo...</p>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </div>
      </ResponsiveDialog>
    </>
  );
}
```

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| open | boolean | Estado actual del diálogo (abierto/cerrado) |
| onOpenChange | (open: boolean) => void | Función llamada cuando cambia el estado |
| title | string (opcional) | Título del diálogo |
| children | ReactNode | Contenido del diálogo |
| className | string (opcional) | Clases CSS adicionales (aplicadas a ambos) |
| mobileClassName | string (opcional) | Clases CSS solo para móvil |
| desktopClassName | string (opcional) | Clases CSS solo para escritorio |
| showCloseButton | boolean (opcional) | Mostrar botón de cerrar (solo móvil) |
| centerTitle | boolean (opcional) | Centrar el título (default: true) |
| showBackButton | boolean (opcional) | Mostrar botón de retroceso (default: true) |
| onBackButtonClick | () => void (opcional) | Función personalizada para el botón de retroceso |

### Ejemplos

#### Con clases personalizadas

```tsx
<ResponsiveDialog
  open={open}
  onOpenChange={setOpen}
  title="Mi título"
  className="bg-gray-50"
  mobileClassName="rounded-t-[40px]"
  desktopClassName="max-w-2xl"
>
  <div>Mi contenido</div>
</ResponsiveDialog>
```

#### Sin título

```tsx
<ResponsiveDialog
  open={open}
  onOpenChange={setOpen}
>
  <div>Diálogo sin título</div>
</ResponsiveDialog>
```

#### Con botón de cerrar en móvil y sin botón de retroceso

```tsx
<ResponsiveDialog
  open={open}
  onOpenChange={setOpen}
  title="Título"
  showCloseButton={true}
  showBackButton={false}
  centerTitle={false} // Alinear título a la izquierda
>
  <div>Contenido con botón de cerrar en móvil</div>
</ResponsiveDialog>
```

#### Con función personalizada para el botón de retroceso

```tsx
<ResponsiveDialog
  open={open}
  onOpenChange={setOpen}
  title="Navegación personalizada"
  onBackButtonClick={() => {
    // Lógica personalizada antes de cerrar
    console.log('Volviendo atrás...');
    handleCustomBack();
  }}
>
  <div>Este diálogo tiene un comportamiento personalizado para el botón de retroceso</div>
</ResponsiveDialog>
``` 