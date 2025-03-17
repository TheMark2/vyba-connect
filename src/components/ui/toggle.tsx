
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted dark:hover:bg-vyba-dark-secondary",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground dark:border-vyba-dark-secondary dark:hover:bg-vyba-dark-secondary dark:text-white",
        segmented: "bg-[#F8F8F8] data-[state=on]:bg-secondary hover:bg-[#F0F0F0] text-gray-600 data-[state=on]:text-black dark:bg-vyba-dark-bg dark:data-[state=on]:bg-vyba-dark-secondary dark:hover:bg-vyba-dark-secondary/70 dark:text-gray-300 dark:data-[state=on]:text-white",
      },
      size: {
        default: "h-12 px-3",
        sm: "h-10 px-2.5",
        lg: "h-14 px-5",
      },
      position: {
        default: "",
        start: "rounded-l-full",
        middle: "rounded-none border-l-0",
        end: "rounded-r-full border-l-0",
        single: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants> & {
      position?: "start" | "middle" | "end" | "single" | "default"
    }
>(({ className, variant, size, position, ...props }, ref) => {
  // Función para manejar el efecto de onda desde el punto de clic
  const handleRippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    // Eliminar el elemento después de la animación
    setTimeout(() => {
      ripple.remove();
    }, 800);
    
    // No modificamos el onClick original porque Radix UI lo maneja internamente
  };

  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, position, className }))}
      {...props}
      onMouseDown={handleRippleEffect}
    />
  )
})

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
