
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
      className={cn("grid gap-4", className)} // Cambiado de gap-0 a gap-4 para dar más espacio entre opciones
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
        "aspect-square h-5 w-5 rounded-full border border-gray-300 text-primary bg-white ring-offset-background focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/60",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-black text-black dark:fill-white dark:text-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// Componente personalizado para la selección de rol con nuevo diseño inspirado en la imagen
const RoleSelector = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    icon?: React.ReactNode;
    label: string;
    features?: string[];
    isFirst?: boolean;
    isLast?: boolean;
  }
>(({ className, icon, label, features = [], isFirst = false, isLast = false, ...props }, ref) => {
  // Usar useState para controlar el estado de selección
  const [isSelected, setIsSelected] = React.useState(false);
  
  // Usar useEffect para monitorear cambios en la prop checked
  React.useEffect(() => {
    setIsSelected(!!props.checked);
  }, [props.checked]);

  return (
    <label className="cursor-pointer">
      <div className={cn(
        "transition-all duration-300 px-4 py-3.5 border rounded-full flex items-center",
        isSelected 
          ? "bg-white dark:bg-vyba-dark-secondary/80 border-gray-800 dark:border-white/80" 
          : "bg-white dark:bg-vyba-dark-bg border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
      )}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn(
                "flex-shrink-0 transition-all duration-300",
                isSelected ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"
              )}>
                {icon}
              </div>
            )}
            <span className={cn(
              "text-base flex-grow transition-all duration-300",
              isSelected ? "text-black dark:text-white font-medium" : "text-gray-700 dark:text-gray-300"
            )}>{label}</span>
          </div>
          
          <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
              "aspect-square h-5 w-5 rounded-full border border-gray-300 bg-white ring-offset-background focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600",
              isSelected ? "border-gray-800 dark:border-white" : "",
              className
            )}
            {...props}
          >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              <div className={cn(
                "h-3 w-3 rounded-full bg-gray-800 dark:bg-white transition-transform duration-300",
                isSelected ? "scale-100" : "scale-0"
              )} />
            </RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.Item>
        </div>
        
        {/* Sección expandible con features cuando está seleccionado */}
        {features.length > 0 && (
          <div className={cn(
            "pl-9 overflow-hidden transition-all duration-300 ease-in-out",
            isSelected 
              ? "max-h-48 opacity-100 mt-4" 
              : "max-h-0 opacity-0 mt-0"
          )}>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div className={cn(
                    "w-1 h-1 bg-black dark:bg-white rounded-full transition-all duration-300",
                    isSelected ? "scale-100" : "scale-0"
                  )}></div>
                  <span className={cn(
                    "text-sm transition-all duration-300",
                    isSelected ? "translate-x-0" : "-translate-x-2"
                  )}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </label>
  )
})
RoleSelector.displayName = "RoleSelector"

export { RadioGroup, RadioGroupItem, RoleSelector }
