
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
  }
>(({ className, icon, label, features = [], ...props }, ref) => {
  // Usar useEffect para monitorear el cambio en checked
  const [isSelected, setIsSelected] = React.useState(false);
  
  React.useEffect(() => {
    // Verificar si está seleccionado basado en la prop checked
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
        
        {/* Sección expandible con features cuando está seleccionado */}
        <div className={cn(
          "overflow-hidden transition-max-height duration-300 ease-in-out bg-white dark:bg-white",
          isSelected 
            ? "max-h-48 opacity-100 translate-y-0 rounded-b-md" 
            : "max-h-0 opacity-0 -translate-y-2"
        )}>
          {features.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100">
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
      </div>
    </label>
  )
})
RoleSelector.displayName = "RoleSelector"

export { RadioGroup, RadioGroupItem, RoleSelector }
