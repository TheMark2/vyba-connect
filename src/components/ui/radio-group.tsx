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
    features?: string[];
  }
>(({ className, label, features = [], ...props }, ref) => {
  const [isSelected, setIsSelected] = React.useState(false);
  
  React.useEffect(() => {
    setIsSelected(!!props.checked);
  }, [props.checked]);

  return (
    <div 
      className={cn(
        "py-3.5 rounded-xl transition-all duration-200 bg-white dark:bg-vyba-dark-secondary/30",
        isSelected 
          ? "bg-white dark:bg-vyba-dark-secondary/30" 
          : "bg-white dark:bg-vyba-dark-secondary/20 hover:bg-white/90 dark:hover:bg-vyba-dark-secondary/25"
      )}
    >
      <label className="cursor-pointer block">
        <div className="flex items-center gap-4">
          <span className={cn(
            "text-base flex-grow font-bold transition-all duration-200",
            isSelected ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"
          )}>
            {label}
          </span>
          
          <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
              "aspect-square h-5 w-5 rounded-full transition-all duration-200 focus:outline-none",
              isSelected 
                ? "border-[1.5px] border-black dark:border-white" 
                : "border-0 bg-gray-200 dark:bg-gray-700",
              className
            )}
            {...props}
          >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              <Circle className="h-2.5 w-2.5 fill-current text-current" />
            </RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.Item>
        </div>
        
        {features.length > 0 && (
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out mt-3",
            isSelected 
              ? "max-h-48 opacity-100" 
              : "max-h-0 opacity-0"
          )}>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-black/70 dark:bg-white/70 rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </label>
    </div>
  )
})
RoleSelector.displayName = "RoleSelector"

export { RadioGroup, RadioGroupItem, RoleSelector }