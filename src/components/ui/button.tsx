import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-regular ring-0 transform focus-visible:scale-[0.97] active:scale-[0.96] transition-transform transition-colors duration-300 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-[#D4DDFF] to-[#F0F3FF] text-primary-foreground hover:from-[#C6D0FF] hover:to-[#E2E6FF]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-[#F7F7F7] bg-transparent text-[#222222] hover:bg-[#EBEBEB]/10 dark:border-vyba-dark-secondary dark:text-white dark:hover:bg-vyba-dark-secondary/10",
        secondary: "bg-[#F7F7F7] text-[#222222] hover:bg-[#F7F7F7]/80 dark:bg-vyba-dark-secondary dark:text-white dark:hover:bg-vyba-dark-secondary/80",
        ghost: "hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-vyba-dark-secondary dark:text-white dark:hover:text-white",
        link: "text-primary underline-offset-4 hover:underline dark:text-white",
        terciary: "bg-[#222222] text-white hover:bg-[#222222]/80 transition-colors duration-300 transition-ease-in-out",
      },
      size: {
        default: "px-6 py-3.5",
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

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading && "relative opacity-80 cursor-not-allowed"
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
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
