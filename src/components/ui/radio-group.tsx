
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
  // Usar un estado que se actualice con el valor de checked
  const [isSelected, setIsSelected] = React.useState(props.checked || false);
  
  // Actualizar el estado cuando cambia el prop checked
  React.useEffect(() => {
    setIsSelected(props.checked === true);
  }, [props.checked]);

  // Función para manejar el clic en todo el div
  const handleDivClick = () => {
    // Solo necesitamos actualizar el estado visual aquí
    setIsSelected(true);
    
    // Activar el RadioGroupPrimitive.Item real
    if (props.onClick) {
      props.onClick({} as React.MouseEvent);
    }
    
    // Llamar a onValueChange con el valor de este elemento
    if (props.value && props.onValueChange) {
      props.onValueChange(props.value);
    }
  };

  return (
    <div 
      className={cn(
        "p-6 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out flex flex-col bg-white",
        isSelected 
          ? "outline outline-[1.5px] outline-black dark:outline-black" 
          : "outline-none"
      )}
      onClick={handleDivClick}
    >
      <div className="flex items-center justify-between">
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
            onClick={(e) => {
              e.stopPropagation(); // Detener la propagación si se hace clic directamente
              if (props.onClick) props.onClick(e);
            }}
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
