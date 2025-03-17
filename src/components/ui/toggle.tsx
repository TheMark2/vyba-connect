
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        segmented: "bg-[#F8F8F8] data-[state=on]:bg-secondary hover:bg-[#F0F0F0] text-gray-600 data-[state=on]:text-black",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
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
>(({ className, variant, size, position, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, position, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
