
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-3xl bg-[#F7F7F7] px-6 py-4 text-base md:text-sm ring-offset-background placeholder:text-gray-500 placeholder:font-regular disabled:cursor-not-allowed disabled:opacity-50 text-black font-regular dark:text-white dark:bg-vyba-dark-secondary/20 dark:placeholder:text-gray-400 transition-all duration-300 ease-in-out",
          "focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-opacity-50 focus:ring-offset-2 focus:outline-none focus:border-transparent ring-offset-white dark:ring-offset-black", 
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
