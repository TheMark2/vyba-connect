
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
      className={cn("grid gap-2", className)}
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
        "aspect-square h-5 w-5 rounded-full border-2 border-black text-primary ring-offset-background focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white",
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

// Componente personalizado para la selección de rol con fondo blanco y animación
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
        "transition-all duration-300",
        isSelected ? "bg-secondary dark:bg-vyba-dark-secondary/40" : "bg-white dark:bg-vyba-dark-bg",
        isFirst ? "rounded-t-2xl" : "",
        isLast ? "rounded-b-2xl" : "",
        !isFirst && !isLast ? "" : ""
      )}>
        <div className="flex items-center gap-3 px-5 py-3.5">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <span className={cn(
            "text-sm font-medium flex-grow",
            isSelected ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"
          )}>{label}</span>
          <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
              "aspect-square h-5 w-5 rounded-full border-2 border-black text-sm ring-offset-background focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white",
              className
            )}
            {...props}
          >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              <Circle className="h-2.5 w-2.5 fill-black text-black dark:fill-white dark:text-white" />
            </RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.Item>
        </div>
        
        {/* Sección expandible con features cuando está seleccionado */}
        {features.length > 0 && (
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out px-5 py-3",
            isSelected 
              ? "max-h-48 opacity-100 translate-y-0" 
              : "max-h-0 opacity-0 -translate-y-2 py-0"
          )}>
            <ul className="space-y-1.5">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div className="w-1 h-1 bg-black dark:bg-white rounded-full"></div>
                  <span className="text-sm">{feature}</span>
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
