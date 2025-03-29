
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

// Componente personalizado para la selección de rol con fondo blanco
const RoleSelector = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    icon?: React.ReactNode;
    label: string;
    features?: string[];
  }
>(({ className, icon, label, features = [], ...props }, ref) => {
  // Verificar si este item está seleccionado
  const [isSelected, setIsSelected] = React.useState(false);
  
  React.useEffect(() => {
    // Corregido: Comprobar si el valor actual coincide con el valor del RoleSelector
    // usando la propiedad checked directamente que es un booleano
    setIsSelected(!!props.checked);
  }, [props.checked]);
  
  return (
    <label className="cursor-pointer">
      <div className={cn(
        "transition-all duration-300",
        isSelected ? "rounded-t-md" : "rounded-md"
      )}>
        <div className="flex items-center gap-3 bg-white dark:bg-white rounded-md px-5 py-3.5">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <span className="text-black text-sm font-medium flex-grow">{label}</span>
          <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
              "aspect-square h-5 w-5 rounded-full border-2 border-black text-sm ring-offset-background focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              <Circle className="h-2.5 w-2.5 fill-black text-black" />
            </RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.Item>
        </div>
        
        {/* Sección extendida con features cuando está seleccionado */}
        {isSelected && features.length > 0 && (
          <div className="bg-white dark:bg-white px-5 py-3 rounded-b-md border-t border-gray-100">
            <ul className="space-y-1.5">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
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
