
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
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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

// Custom selector component for role selection
interface RoleSelectorProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  features: string[];
  isFirst: boolean;
  isLast: boolean;
  isMobile?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  label,
  icon,
  features,
  isFirst,
  isLast,
  isMobile = false
}) => {
  return (
    <label
      htmlFor={`role-${value}`}
      className={cn(
        "relative flex cursor-pointer rounded-none border-0 bg-white dark:bg-vyba-dark-secondary p-4 transition-all",
        isFirst && "rounded-t-2xl",
        isLast && "rounded-b-2xl border-t border-t-gray-100 dark:border-t-gray-700"
      )}
    >
      <RadioGroupPrimitive.Item
        id={`role-${value}`}
        value={value}
        className="peer sr-only"
      />
      <div className="absolute top-0 right-0 p-3 opacity-0 transition-opacity peer-data-[state=checked]:opacity-100">
        <div className="h-6 w-6 rounded-full bg-black dark:bg-white flex items-center justify-center">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L5 9L1 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-black" />
          </svg>
        </div>
      </div>

      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 w-full`}>
        <div className={`rounded-full bg-gray-100 dark:bg-gray-800 ${isMobile ? 'h-12 w-12' : 'h-16 w-16'} flex items-center justify-center shrink-0 peer-data-[state=checked]:bg-black dark:peer-data-[state=checked]:bg-white`}>
          <div className="text-black dark:text-white peer-data-[state=checked]:text-white dark:peer-data-[state=checked]:text-black">
            {icon}
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <div className="font-medium text-lg dark:text-white">
            {label}
          </div>
          
          <ul className={`space-y-1 text-sm text-gray-600 dark:text-gray-400 ${isMobile ? 'pl-4' : 'pl-0'}`}>
            {features.map((feature, index) => (
              <li key={index} className={`${isMobile ? 'text-xs' : 'text-sm'} flex items-center gap-1`}>
                <span className="h-1 w-1 rounded-full bg-black dark:bg-white inline-block"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </label>
  )
}

export { RadioGroup, RadioGroupItem, RoleSelector }
