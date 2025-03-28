
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const combinedRef = useCombinedRefs(ref, inputRef)

    React.useEffect(() => {
      if (inputRef.current && inputRef.current.value) {
        setHasValue(true)
      } else {
        setHasValue(false)
      }
    }, [props.value])

    const shouldFloatLabel = isFocused || hasValue

    return (
      <div className="relative">
        {props.placeholder && (
          <span
            className={cn(
              "absolute left-3 pointer-events-none transition-all duration-300 text-muted-foreground",
              shouldFloatLabel 
                ? "transform -translate-y-6 text-xs" 
                : "transform translate-y-0 text-base"
            )}
          >
            {props.placeholder}
          </span>
        )}
        <input
          {...props}
          placeholder=""
          className={cn(
            "flex h-10 w-full rounded-md bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pt-4",
            className
          )}
          ref={combinedRef}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus && props.onFocus(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur && props.onBlur(e)
          }}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0)
            props.onChange && props.onChange(e)
          }}
        />
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
