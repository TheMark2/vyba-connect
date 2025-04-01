
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const combinedRef = useCombinedRefs(ref, inputRef)

    return (
      <div className="relative">
        <input
          {...props}
          className={cn(
            "flex h-12 w-full rounded-md bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 text-black font-medium placeholder:font-normal placeholder:text-sm dark:text-white dark:bg-black dark:placeholder:text-gray-400",
            className
          )}
          ref={combinedRef}
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
