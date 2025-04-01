
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
      className={cn("grid gap-0", className)}
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
        "aspect-square h-5 w-5 rounded-full border-2 border-black text-primary ring-offset-background focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white transition-all duration-300",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-black text-black dark:fill-white dark:text-white transition-all duration-300" />
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
  // Usar useState para controlar el estado de selección y hover
  const [isSelected, setIsSelected] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Usar useEffect para monitorear cambios en la prop checked
  React.useEffect(() => {
    setIsSelected(!!props.checked);
  }, [props.checked]);

  return (
    <label 
      className="cursor-pointer" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        isSelected 
          ? "bg-secondary dark:bg-vyba-dark-secondary/40" 
          : isHovered 
            ? "bg-gray-50 dark:bg-vyba-dark-bg/80" 
            : "bg-white dark:bg-vyba-dark-bg",
        isFirst ? "rounded-t-2xl" : "",
        isLast ? "rounded-b-2xl" : "",
        !isFirst && !isLast ? "border-t-0" : ""
      )}>
        <div className={cn(
          "flex items-center gap-3 px-5 py-3.5 transition-transform duration-300",
          isHovered && !isSelected ? "translate-x-1" : "translate-x-0"
        )}>
          {icon && (
            <div className={cn(
              "flex-shrink-0 transition-all duration-300",
              isSelected 
                ? "scale-110 text-primary-foreground" 
                : isHovered 
                  ? "scale-105 rotate-3" 
                  : "scale-100"
            )}>
              {icon}
            </div>
          )}
          <span className={cn(
            "text-sm font-medium flex-grow transition-all duration-300",
            isSelected 
              ? "text-black dark:text-white font-bold" 
              : isHovered 
                ? "text-black dark:text-gray-200" 
                : "text-gray-700 dark:text-gray-300"
          )}>{label}</span>
          <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
              "aspect-square h-5 w-5 rounded-full border-2 border-black text-sm ring-offset-background focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white transition-all duration-300",
              isSelected ? "border-[3px]" : isHovered ? "scale-110" : "",
              className
            )}
            {...props}
          >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              <Circle className={cn(
                "fill-black text-black dark:fill-white dark:text-white transition-all duration-300",
                isSelected ? "h-2.5 w-2.5 animate-pulse" : "h-2 w-2 scale-0 animate-in"
              )} />
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
                <li 
                  key={index} 
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'forwards',
                    opacity: 0
                  }}
                  className={cn(
                    "flex items-center gap-2 text-gray-600 dark:text-gray-400",
                    isSelected ? "animate-feature-item-appear" : ""
                  )}
                >
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
