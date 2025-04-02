
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
  const [isSelected, setIsSelected] = React.useState(false);
  
  React.useEffect(() => {
    setIsSelected(!!props.checked);
  }, [props.checked]);

  return (
    <div 
      className={cn(
        "p-6 rounded-3xl transition-all duration-200 flex flex-col",
        isSelected 
          ? "bg-white dark:bg-white border-0" 
          : "bg-transparent border-[1.5px] border-black dark:border-white hover:border-[2px] hover:shadow-sm"
      )}
    >
      <label className="cursor-pointer block w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className={cn(
              "text-xl font-bold transition-all duration-200",
              isSelected ? "text-black dark:text-black" : "text-black dark:text-white"
            )}>
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
              <span className={cn(
                "text-3xl",
                isSelected ? "text-black dark:text-black" : "text-black dark:text-white"
              )}>
                {icon}
              </span>
            )}
            <RadioGroupPrimitive.Item
              ref={ref}
              className="hidden"
              {...props}
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
