
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
      className={cn("grid gap-0", className)} // Changed gap-2 to gap-0
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
        !isFirst && !isLast ? "border-t-0" : "" // Added this to ensure no border at connecting points
      )}>
        <div className="flex items-center gap-3 px-5 py-3.5 relative overflow-hidden group">
          {icon && (
            <div className={cn(
              "flex-shrink-0 transition-transform duration-500",
              isSelected ? "scale-110 rotate-3" : "scale-100 group-hover:scale-105 group-hover:rotate-1"
            )}>
              {icon}
            </div>
          )}
          <span className={cn(
            "text-sm font-medium flex-grow transition-all duration-300",
            isSelected ? "text-black dark:text-white font-bold" : "text-gray-700 dark:text-gray-300 group-hover:translate-x-0.5"
          )}>{label}</span>
          <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
              "aspect-square h-5 w-5 rounded-full border-2 border-black text-sm ring-offset-background focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white transition-all duration-300 relative",
              isSelected ? "border-[3px]" : "group-hover:scale-105",
              className
            )}
            {...props}
          >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              <Circle className={cn(
                "fill-black text-black dark:fill-white dark:text-white transition-all duration-300",
                isSelected ? "h-2.5 w-2.5 animate-pulse" : "h-2 w-2 opacity-0 group-hover:opacity-50"
              )} />
            </RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.Item>
        </div>
        
        {/* Sección expandible con features cuando está seleccionado */}
        {features.length > 0 && (
          <div className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out px-5",
            isSelected 
              ? "max-h-52 opacity-100" 
              : "max-h-0 opacity-0"
          )}>
            <ul className="space-y-1.5 pb-4">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    transform: isSelected ? 'translateX(0)' : 'translateX(-10px)',
                    opacity: isSelected ? 1 : 0,
                    transition: 'transform 0.4s ease, opacity 0.4s ease'
                  }}
                >
                  <div className={cn(
                    "w-1 h-1 bg-black dark:bg-white rounded-full transition-all duration-300",
                    isSelected ? "scale-100" : "scale-0"
                  )}></div>
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
