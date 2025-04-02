import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, fullWidth = true, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const combinedRef = useCombinedRefs(ref, inputRef)
    const [isFocused, setIsFocused] = React.useState(false)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (props.onFocus) props.onFocus(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      if (props.onBlur) props.onBlur(e)
    }

    return (
      <div className={cn("flex flex-col gap-2", fullWidth ? "w-full" : "")}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="text-black font-bold text-2xl"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "flex h-16 w-full rounded-full bg-[#F7F7F7] px-6 py-4 text-lg file:border-0 file:bg-transparent file:text-lg file:font-medium",
              "text-black font-medium placeholder:font-medium placeholder:text-gray-400",
              "focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              isFocused 
                ? "outline outline-2 outline-[#666666] border-transparent" 
                : "border border-transparent",
              className
            )}
            ref={combinedRef}
          />
        </div>
      </div>
    )
  }
)

// Helper function to combine refs
function useCombinedRefs<T>(
  ...refs: Array<React.Ref<T> | null | undefined>
): React.RefCallback<T> {
  return React.useCallback((element: T) => {
    refs.forEach((ref) => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(element)
      } else {
        (ref as React.MutableRefObject<T>).current = element
      }
    })
  }, [refs])
}

Input.displayName = "Input"

export { Input }