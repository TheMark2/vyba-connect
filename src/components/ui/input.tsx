
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showVerified?: false | "verified" | "google" | "not-registered";
  error?: boolean;
  variant?: "default" | "hero" | "ghost";
  inputSize?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showVerified, error, variant = "default", inputSize = "md", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full font-figtree placeholder:font-figtree rounded-xl bg-[#F7F7F7] px-6 py-3 text-base md:text-sm placeholder:text-[#969494] disabled:cursor-not-allowed disabled:opacity-50 text-black font-regular placeholder:font-regular",
          {
            "h-10": inputSize === "sm",
            "h-14": inputSize === "md",
            "h-16": inputSize === "lg",
            "bg-[#F1F1F1]": variant === "default",
            "bg-transparent border-2 border-black dark:border-white": variant === "hero",
            "bg-transparent": variant === "ghost",
            "border-[#C13515] border-2": error,
            "focus:bg-[#F1F1F1] hover:bg-[#EAEAEA] transition-all duration-500 ease-in-out": variant === "default",
          },
          "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
