
import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    variant?: string;
    size?: string;
  }
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants> & {
      variant?: "default" | "outline" | "segmented";
    }
>(({ className, variant = "segmented", size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("inline-flex", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const count = React.Children.count(children);
        let position: "start" | "middle" | "end" | "single" = "middle";
        
        if (count === 1) {
          position = "single";
        } else if (index === 0) {
          position = "start";
        } else if (index === count - 1) {
          position = "end";
        }
        
        return React.cloneElement(child as React.ReactElement<any>, {
          position,
        });
      })}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants> & {
      position?: "start" | "middle" | "end" | "single" | "default";
    }
>(({ className, children, variant, size, position, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);
  
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant as any || variant,
          size: context.size as any || size,
          position: position || "default",
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
