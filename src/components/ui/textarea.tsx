
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "rounded-2xl bg-[#F7F7F7] flex min-h-[80px] w-full p-6 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-500 placeholder:font-regular border border-transparent transition-shadow",
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
