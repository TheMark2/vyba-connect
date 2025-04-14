
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-3xl bg-[#F7F7F7] px-6 py-4 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 text-black font-medium placeholder:font-medium dark:text-white dark:bg-vyba-dark-secondary/20 dark:placeholder:text-gray-400 hover:bg-[#F0F0F0] dark:hover:bg-vyba-dark-secondary/30",
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
