
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
          "flex h-14 w-full rounded-2xl bg-[#F7F7F7] px-6 py-3 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out text-black font-medium placeholder:font-medium dark:text-white dark:bg-[#F7F7F7] dark:placeholder:text-gray-400",
          error ? "border-[#C13515] border-2" : "",
          "focus-visible:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-opacity-50 focus:ring-offset-2 focus:border-transparent",
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
