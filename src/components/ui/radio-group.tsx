
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

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
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

interface RoleSelectorProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label: string;
  icon: React.ReactNode;
  features?: string[];
}

const RoleSelector = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RoleSelectorProps
>(({ className, label, icon, features = [], ...props }, ref) => {
  const { value } = props;
  const isSelected = value === props.value;

  return (
    <div className="relative">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "border-2 border-[#F5F1EB] dark:border-vyba-dark-secondary rounded-xl w-full p-5 relative ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
          isSelected ? "bg-[#F5F1EB] dark:bg-vyba-dark-secondary" : "bg-white dark:bg-vyba-dark-bg",
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F1EB] dark:bg-vyba-dark-secondary">
            {icon}
          </div>
          <span className="text-lg font-bold">{label}</span>
          <div className="absolute right-4 top-5 flex items-center justify-center w-5 h-5 rounded-full border border-primary">
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full" />
            </RadioGroupPrimitive.Indicator>
          </div>
        </div>
      </RadioGroupPrimitive.Item>

      {/* Features list with animation */}
      <div 
        className={cn(
          "grid transition-all duration-300 ease-in-out overflow-hidden",
          isSelected ? "grid-rows-[1fr] mt-3 opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden min-h-0">
          <ul className="pl-12 space-y-2">
            {features.map((feature, index) => (
              <li 
                key={index} 
                className="flex items-center text-sm text-muted-foreground"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: isSelected ? 'fadeInUp 0.4s forwards' : 'none'
                }}
              >
                <svg 
                  className="w-4 h-4 mr-2 text-primary" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M7.5 12L10.5 15L16.5 9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});
RoleSelector.displayName = "RoleSelector";

export { RadioGroup, RoleSelector };

