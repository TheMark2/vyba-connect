
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold ring-0 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[#F7F7F7] bg-transparent text-[#222222] hover:bg-[#EBEBEB]/10 dark:border-vyba-dark-secondary dark:text-white dark:hover:bg-vyba-dark-secondary/10",
        secondary:
          "bg-[#F7F7F7] text-[#222222] hover:bg-[#F7F7F7]/80 dark:bg-vyba-dark-secondary dark:text-white dark:hover:bg-vyba-dark-secondary/80",
        ghost: "hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-vyba-dark-secondary dark:text-white dark:hover:text-white",
        link: "text-primary underline-offset-4 hover:underline dark:text-white",
      },
      size: {
        default: "px-6 py-3",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
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
      
      // Llamar al onClick original si existe
      if (props.onClick) {
        props.onClick(event);
      }
    };
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading && "relative opacity-80 cursor-not-allowed"
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
        onClick={handleRippleEffect}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
