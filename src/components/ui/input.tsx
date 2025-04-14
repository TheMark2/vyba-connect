
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showVerified?: false | "verified" | "google" | "not-registered";
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showVerified, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-xl bg-[#F7F7F7] px-6 py-3 text-base md:text-sm ring-offset-background placeholder:text-gray-500 placeholder:font-regular disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out text-black font-medium",
          error ? "border-[#C13515] border-2" : "",
          "focus:ring-2 focus:ring-black focus:ring-opacity-50 focus:ring-offset-2 focus:outline-none focus:border-transparent ring-offset-white dark:ring-offset-black dark:focus:ring-white", 
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
