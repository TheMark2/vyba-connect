
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-4", className)} 
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-5 w-5 rounded-full border border-black text-primary ring-offset-background transition-all focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white hover:border-2",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// Componente personalizado para la selección de rol con diseño minimalista
const RoleSelector = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    label: string;
    description?: string;
    icon?: React.ReactNode;
    features?: string[];
  }
>(({ className, label, description, icon, features = [], ...props }, ref) => {
  const isSelected = props.checked === true;
  
  // Creamos una referencia para el botón de radio
  const radioRef = React.useRef<HTMLButtonElement>(null);
  
  const handleContainerClick = React.useCallback((e: React.MouseEvent) => {
    // Evitar recursión y burbujas de eventos
    if (e.target === radioRef.current) return;
    
    // Simular un clic directo en el elemento de radio sin usar querySelector
    if (radioRef.current) {
      radioRef.current.click();
    }
  }, []);
  
  return (
    <div 
      className={cn(
        "p-6 rounded-2xl transition-all duration-500 ease-in-out flex flex-col bg-white cursor-pointer",
        isSelected 
          ? "bg-[#F5F1EB]" 
          : "bg-white"
      )}
      onClick={handleContainerClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-black">
            {label}
          </span>
          {description && (
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          {icon && (
            <span className="text-3xl text-black">
              {icon}
            </span>
          )}
          <RadioGroupPrimitive.Item
            ref={(node) => {
              // Manejar correctamente la ref compuesta
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              radioRef.current = node;
            }}
            className="hidden"
            {...props}
          >
            <RadioGroupPrimitive.Indicator />
          </RadioGroupPrimitive.Item>
        </div>
      </div>
    </div>
  )
})
RoleSelector.displayName = "RoleSelector"

export { RadioGroup, RadioGroupItem, RoleSelector }
