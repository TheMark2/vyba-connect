
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ className, onChange, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          {...props}
          onChange={onChange}
          className={cn(
            "flex h-12 w-full rounded-md bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-black font-medium placeholder:font-medium placeholder:text-muted-foreground dark:text-white dark:bg-black dark:placeholder:text-gray-400 placeholder:text-sm",
            className
          )}
          ref={ref}
        />
      </div>
    )
  }
)

Input.displayName = "Input"
export { Input }
