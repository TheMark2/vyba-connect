import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-12 w-full rounded-xl bg-[#F7F7F7] px-6 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-0 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 text-black font-medium dark:text-white dark:bg-vyba-dark-secondary/20 dark:placeholder:text-gray-400 hover:bg-[#F0F0F0] dark:hover:bg-vyba-dark-secondary/30",
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