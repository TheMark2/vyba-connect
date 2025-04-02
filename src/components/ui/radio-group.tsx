
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
  // El problema está en cómo manejamos el estado isSelected
  // Necesitamos usar props.checked para determinar el estado inicial y también actualizarlo cuando cambia
  
  // Usar un estado que se actualice con el valor de checked
  const [isSelected, setIsSelected] = React.useState(props.checked || false);
  
  // Actualizar el estado cuando cambia el prop checked
  React.useEffect(() => {
    setIsSelected(props.checked === true);
  }, [props.checked]);

  return (
    <div 
      className={cn(
        "p-6 rounded-3xl transition-all duration-400 flex flex-col bg-white",
        isSelected 
          ? "border-4 border-black dark:border-black" 
          : "border-0"
      )}
    >
      <label className="cursor-pointer block w-full">
        <div className="flex items-center justify-between mb-3">
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
              ref={ref}
              className="hidden"
              {...props}
              onClick={() => setIsSelected(true)} // Aseguramos que se actualice el estado al hacer click
            >
              <RadioGroupPrimitive.Indicator />
            </RadioGroupPrimitive.Item>
          </div>
        </div>
        
        {features.length > 0 && (
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isSelected 
              ? "max-h-48 opacity-100" 
              : "max-h-48 opacity-80"
          )}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {features.join(', ')}
            </p>
          </div>
        )}
      </label>
    </div>
  )
})
RoleSelector.displayName = "RoleSelector"

export { RadioGroup, RadioGroupItem, RoleSelector }
